import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

const CreateUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        next();

    } catch (error) {
        let errors2 = {};
        if (error.code === 11000) {
            errors2.email = "This email is registered";
        }
        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach((key) => {
                errors2[key] = error.errors[key].message;
            });
        }
        res.status(400).json(errors2);
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        let check = false;
        if (user) {
            check = await bcrypt.compare(password, user.password);
        } else {
            return res.status(401).json({
                succeded: false,
                error: "The user of the entered data could not be found",
            })
        }
        if (check) {
            const token = CreateUserToken(user._id, user.seller, user.admin);
            res.cookie('userdt', token, {
                path: '/',
                httpOnly: false,
                secure: true,
                maxAge: 1000 * 60 * 60 * 24, // ms -> 1 day
            })
            res.status(201).json({
                succeded: true,
                user,
                token,
            });
        } else {
            res.status(401).json({
                succeded: false,
                error: "The entered password is incorrect",
            })
        }

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Check your information"
        });
    }
};

const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(201).json({
            succeded: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Users could not be found",
        })
    }
}

const UserMe = async (req, res, next) => {
    const token = req.cookies.userdt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodeToken) => {
            if (error) {
                res.status(401).json({
                    succeded: false,
                    error: "You are not authorized to access the page",
                })
                next();
            } else {
                const user = await User.findById(decodeToken.userId);
                res.status(201).json({
                    succeded: true,
                    user,
                    token
                })
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

const NewPasswordReset = async (req, res) => {
    try {
        const email = req.params.email;
        if (email) {
            jwt.verify(email, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    res.status(401).json({
                        succeded: false,
                        err: "The user of the entered data could not be found",
                    });
                } else {
                    const user = await User.findOne({ email: decodedToken.userMail });

                    const { newPassword } = req.body;

                    user.password = newPassword;
                    await user.save();

                    res.status(201).json({
                        succeded: true,
                        message:"The old password was successfully reset"
                    });
                }
            });
        } else {
            res.status(500).json({
                succeded: false,
                error: "No user found for the entered data",
            });
        }
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "No user found for the entered data",
        });
    }
}

const CreateUserToken = (userId, seller, userRole) => {
    return jwt.sign({ userId, seller, userRole }, process.env.JWT_SECRET, {
        expiresIn: "1day",
    });
}

const CreateSendMailToken = (userMail) => {
    return jwt.sign({ userMail }, process.env.JWT_SECRET, {
        expiresIn: "2h", // h -> 2 hour
    });
}
// Send to mail operation

const WebsiteWelcomeMail = async (req, res) => {
    const htmlTemplate = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta content="width=device-width, initial-scale=1" name="viewport">
<meta name="x-apple-disable-message-reformatting">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="telephone=no" name="format-detection">
<title>Registration Confirmation</title><!--[if (mso 16)]>
<style type="text/css">
a {text-decoration: none;}
</style>
<![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG></o:AllowPNG>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<style type="text/css">
.rollover:hover .rollover-first {
max-height:0px!important;
display:none!important;
}
.rollover:hover .rollover-second {
max-height:none!important;
display:inline-block!important;
}
.rollover div {
font-size:0px;
}
u ~ div img + div > div {
display:none;
}
#outlook a {
padding:0;
}
span.MsoHyperlink,
span.MsoHyperlinkFollowed {
color:inherit;
mso-style-priority:99;
}
a.es-button {
mso-style-priority:100!important;
text-decoration:none!important;
}
a[x-apple-data-detectors] {
color:inherit!important;
text-decoration:none!important;
font-size:inherit!important;
font-family:inherit!important;
font-weight:inherit!important;
line-height:inherit!important;
}
.es-desk-hidden {
display:none;
float:left;
overflow:hidden;
width:0;
max-height:0;
line-height:0;
mso-hide:all;
}
.es-header-body a:hover {
color:#666666!important;
}
.es-content-body a:hover {
color:#5c68e2!important;
}
.es-footer-body a:hover {
color:#333333!important;
}
.es-infoblock a:hover {
color:#cccccc!important;
}
.es-button-border:hover > a.es-button {
color:#ffffff!important;
}
.es-button-border:hover a.es-button {
color:#ffffff!important;
}
@media only screen and (max-width:600px) {*[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:20px!important } a.es-button, button.es-button { display:inline-block!important } .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } }
</style>
</head>
<body style="width:100%;height:100%;padding:0;Margin:0">
<div class="es-wrapper-color" style="background-color:#FAFAFA"><!--[if gte mso 9]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
<v:fill type="tile" color="#fafafa"></v:fill>
</v:background>
<![endif]-->
<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
<tr>
<td valign="top" style="padding:0;Margin:0">
<table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
<tr class="es-visible-simple-html-only">
<td class="es-stripe-html" align="center" style="padding:0;Margin:0">
<table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
<tr>
<td align="left" style="Margin:0;padding-top:45px;padding-right:20px;padding-bottom:30px;padding-left:20px">
<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td align="center" valign="top" style="padding:0;Margin:0;width:560px">
<table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://xckbdl.stripocdn.email/content/guids/CABINET_f3fc38cf551f5b08f70308b6252772b8/images/96671618383886503.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="100"></td>
</tr>
<tr>
<td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:15px;padding-bottom:40px"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:55px;color:#333333">Thanks For Joining Us!</h1></td>
</tr>
<tr>
<td align="center" style="padding:0;Margin:0;padding-bottom:10px;padding-top:25px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:24px;letter-spacing:0;color:#333333;font-size:16px;margin-left:40px">Hello, 
${req.body.username} Thank you for joining us! You are now a member of ShopPlace. This means that you will be able to see our new news and benefit from the services we offer you!</p></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
<tr>
<td class="esdev-adapt-off" align="left" style="padding:35px;Margin:0">
<table cellpadding="0" cellspacing="0" class="esdev-mso-table" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
<tr>
<td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
<table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
<tr>
<td align="left" style="padding:0;Margin:0;width:530px">
<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td align="center" style="padding:0;Margin:0;display:none"></td>
</tr>
</table></td>
</tr>
</table></td>
<td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
<table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
<tr>
<td align="left" style="padding:0;Margin:0;width:530px">
<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:10px 0 0 10px;background-color:#e8eafb" bgcolor="#e8eafb" role="presentation">
<tr>
<td align="right" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">E-Mail:</p></td>
</tr>
<tr>
<td align="right" style="padding:0;Margin:0;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Password:</p></td>
</tr>
</table></td>
</tr>
</table></td>
<td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
<table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
<tr>
<td align="left" style="padding:0;Margin:0;width:530px">
<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:0 10px 10px 0;background-color:#e8eafb" bgcolor="#e8eafb" role="presentation">
<tr>
<td align="left" style="padding:0;Margin:0;padding-top:10px;padding-left:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>
${req.body.email}</strong></p></td>
</tr>
<tr>
<td align="left" style="padding:0;Margin:0;padding-bottom:10px;padding-left:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>
${req.body.password}</strong></p></td>
</tr>
</table></td>
</tr>
</table></td>
<td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
<table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
<tr>
<td align="left" style="padding:0;Margin:0;width:530px">
<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td align="center" style="padding:0;Margin:0;display:none"></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
<tr>
<td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-bottom:10px">
<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td align="center" valign="top" style="padding:0;Margin:0;width:560px">
<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:5px" role="presentation">
<tr>
<td align="center" style="padding:0;Margin:0;padding-top:25px;padding-bottom:25px"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#5C68E2;border-width:0px;display:inline-block;border-radius:6px;width:auto"><a 
href="http://localhost:3000/Login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5C68E2;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px !important;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #5C68E2;border-left-width:30px;border-right-width:30px">Login</a></span></td>
</tr>
<tr>
<td align="left" style="padding:0;Margin:0;padding-top:30px;padding-bottom:20px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Is there a problem? Send an e-mail from the Contact us section .</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Thanks</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">ShopPlace Team!</p></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table>
</div>
</body>
</html>
    `;
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODE_MAIL,
                pass: process.env.NODE_PASS,
            },
        });
        await transporter.sendMail({
            to: `${req.body.email}`,
            subject: process.env.NODE_MAIL,
            html: htmlTemplate,
        });
        res.status(201).json({
            succeded: true,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Registered failed and Mail could not be sent",
        });
    }
}

const ForgotPasswordSendMail = async (req, res) => {
    const htmlTemplate = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>PasswordReset</title><!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
    <xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <style type="text/css">
    .rollover:hover .rollover-first {
    max-height:0px!important;
    display:none!important;
    }
    .rollover:hover .rollover-second {
    max-height:none!important;
    display:inline-block!important;
    }
    .rollover div {
    font-size:0px;
    }
    u ~ div img + div > div {
    display:none;
    }
    #outlook a {
    padding:0;
    }
    span.MsoHyperlink,
    span.MsoHyperlinkFollowed {
    color:inherit;
    mso-style-priority:99;
    }
    a.es-button {
    mso-style-priority:100!important;
    text-decoration:none!important;
    }
    a[x-apple-data-detectors] {
    color:inherit!important;
    text-decoration:none!important;
    font-size:inherit!important;
    font-family:inherit!important;
    font-weight:inherit!important;
    line-height:inherit!important;
    }
    .es-desk-hidden {
    display:none;
    float:left;
    overflow:hidden;
    width:0;
    max-height:0;
    line-height:0;
    mso-hide:all;
    }
    .es-header-body a:hover {
    color:#666666!important;
    }
    .es-content-body a:hover {
    color:#5c68e2!important;
    }
    .es-footer-body a:hover {
    color:#333333!important;
    }
    .es-infoblock a:hover {
    color:#cccccc!important;
    }
    .es-button-border:hover > a.es-button {
    color:#ffffff!important;
    }
    @media only screen and (max-width:600px) {.es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:20px!important } a.es-button, button.es-button { display:inline-block!important } .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } }
    </style>
    </head>
    <body style="width:100%;height:100%;padding:0;Margin:0">
    <div class="es-wrapper-color" style="background-color:#FAFAFA"><!--[if gte mso 9]>
    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
    <v:fill type="tile" color="#fafafa"></v:fill>
    </v:background>
    <![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
    <tr>
    <td valign="top" style="padding:0;Margin:0">
    <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
    <tr class="es-visible-simple-html-only">
    <td class="es-stripe-html" align="center" style="padding:0;Margin:0">
    <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
    <tr>
    <td align="left" style="padding:0;Margin:0;padding-top:15px;padding-right:20px;padding-left:20px">
    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://xckbdl.stripocdn.email/content/guids/CABINET_91d375bbb7ce4a7f7b848a611a0368a7/images/69901618385469411.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="100"></td>
    </tr>
    <tr>
    <td align="center" class="es-m-p0r es-m-p0l es-m-txt-c" style="Margin:0;padding-top:15px;padding-right:40px;padding-bottom:15px;padding-left:40px"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:55px;color:#333333">Password reset&nbsp;</h1></td>
    </tr>
    <tr>
    <td align="left" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">After you click the button, you'll be asked to complete the following steps:</p>
    <ol style="font-family:arial, 'helvetica neue', helvetica, sans-serif;padding:0px 0px 0px 40px;margin:15px 0px">
    <li style="color:#333333;margin:0px 0px 15px">Enter a new password.</li>
    <li style="color:#333333;margin:0px 0px 15px">Confirm your new password.</li>
    <li style="color:#333333;margin:0px 0px 15px">Click Submit.</li>
    </ol></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    <tr>
    <td align="left" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-bottom:20px">
    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:5px" role="presentation">
    <tr>
    <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#5C68E2;border-width:0px;display:inline-block;border-radius:6px;width:auto"><a 
    href="http://localhost:3000/NewPassword" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5C68E2;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px !important;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #5C68E2;border-left-width:30px;border-right-width:30px">
    RESET YOUR PASSWORD</a></span></td>
    </tr>
    <tr>
    <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px"><h3 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:bold;line-height:30px;color:#333333">This link is valid for one use only. Expires in 2 hours.</h3></td>
    </tr>
    <tr>
    <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">If you didn't request to reset your&nbsp;password, please disregard this message or contact our customer service department.</p></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table>
    <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
    <tr class="es-visible-simple-html-only">
    <td class="es-stripe-html" align="center" style="padding:0;Margin:0">
    <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
    <tr>
    <td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:20px;padding-top:20px">
    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="left" style="padding:0;Margin:0;width:560px">
    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0">
    <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Facebook" src="https://xckbdl.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
    <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Twitter" src="https://xckbdl.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png" alt="Tw" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
    <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Instagram" src="https://xckbdl.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
    <td align="center" valign="top" style="padding:0;Margin:0"><img title="Youtube" src="https://xckbdl.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
    </tr>
    </table></td>
    </tr>
    <tr>
    <td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">
    ShopPlace © 2023&nbsp;</p></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table>
    </div>
    </body>
    </html>
    `;
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).count();
        if (user > 0) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.NODE_MAIL,
                    pass: process.env.NODE_PASS,
                },
            });

            let token = CreateSendMailToken(req.body.email);
            res.cookie('passPres', token, {
                path: '/',
                httpOnly: false,
                secure: true,
                maxAge: 1000 * 60 * 60 * 2,
            })
            await transporter.sendMail({
                to: `${req.body.email}`,
                subject: `Mail From: ${process.env.NODE_MAIL}`,
                html: htmlTemplate,
            });
            res.status(201).json({
                succeded: true,
            });
        } else {
            res.status(500).json({
                succeded: false,
                error: error.message
            });
        }
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Not a registered email"
        });
    }

}

export { CreateUser, LoginUser, GetAllUsers, UserMe, NewPasswordReset, CreateUserToken, CreateSendMailToken, WebsiteWelcomeMail, ForgotPasswordSendMail }