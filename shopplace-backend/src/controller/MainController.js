import ClothesProduct from "../models/ClothesProductModel.js";
import ShoesProduct from "../models/ShoesProductModel.js";
import ElectronicProduct from "../models/ElectronicProductModel.js";
import PersonalCareProduct from "../models/PersonalCareProductModel.js";
import BagProduct from "../models/BagProductModel.js";
import FavoriteProduct from "../models/FavoritesModal.js"
import OrdersReceived from '../models/OrdersReceivedModel.js'
import nodemailer from "nodemailer";
import mongoose from "mongoose";


const GetHomeAllProducts = async (req, res) => {
    let { search } = req.query;

    try {
        const clothesProduct = await ClothesProduct.find({ "productName": new RegExp(search, "i") });
        const clothesCount = await ClothesProduct.countDocuments();

        const shoesProduct = await ShoesProduct.find({ "productName": new RegExp(search, "i") });
        const shoesCount = await ShoesProduct.countDocuments();

        const electronicProduct = await ElectronicProduct.find({ "productName": new RegExp(search, "i") });
        const ElectronicCount = await ElectronicProduct.countDocuments();

        const personalCareProduct = await PersonalCareProduct.find({ "productName": new RegExp(search, "i") });
        const personalCareCount = await PersonalCareProduct.countDocuments();

        const bagProduct = await BagProduct.find({ "productName": new RegExp(search, "i") });
        const bagCount = await BagProduct.countDocuments();


        const allProducts = clothesProduct.concat(shoesProduct, electronicProduct, personalCareProduct, bagProduct);

        res.status(200).json({
            succeded: true,
            message: 'The products were successfully found',
            allProducts,
            clothesCount,
            shoesCount,
            ElectronicCount,
            personalCareCount,
            bagCount
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The products could not be found'
        })
    }
}


const GetSellerAllProducts = async (req, res) => {
    try {
        const allProducts = [];
        // Bu durumda butun şemalara istek atmak zorundayım ve kontrolu sağlayıp diziye aktarmalıyım mongo sadece bu şekilde izin veriyor.

        const clothesProduct = await ClothesProduct.find({ productOwner: res.locals.user._id })
        if (clothesProduct.length > 0) {
            allProducts.push(...clothesProduct);
        }

        const shoesProduct = await ShoesProduct.find({ productOwner: res.locals.user._id })
        if (shoesProduct.length > 0) {
            allProducts.push(...shoesProduct);
        }

        const electronicProduct = await ElectronicProduct.find({ productOwner: res.locals.user._id })
        if (electronicProduct.length > 0) {
            allProducts.push(...electronicProduct);
        }

        const personalCareProduct = await PersonalCareProduct.find({ productOwner: res.locals.user._id })
        if (personalCareProduct.length > 0) {
            allProducts.push(...personalCareProduct);
        }

        const bagProduct = await BagProduct.find({ productOwner: res.locals.user._id })
        if (bagProduct.length > 0) {
            allProducts.push(...bagProduct);
        }


        res.status(201).json({
            succeded: true,
            message: 'The products were successfully found',
            allProducts
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "The products could not be found"
        })
    }
}


const WebsiteSendMail = async (req, res) => {
    const htmlTemplate = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>New message</title><!--[if (mso 16)]>
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
    @media only screen and (max-width:600px) {.es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:20px!important } a.es-button, button.es-button { display:inline-block!important } .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } }
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
    <tr>
    <td class="es-info-area" align="center" style="padding:0;Margin:0">
    <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF">
    <tr>
    <td align="left" style="padding:20px;Margin:0">
    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table>
    <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
    <tr class="es-visible-simple-html-only">
    <td class="es-stripe-html" align="center" style="padding:0;Margin:0">
    <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
    <tr>
    <td align="left" style="Margin:0;padding-top:30px;padding-right:20px;padding-bottom:30px;padding-left:20px">
    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://xckbdl.stripocdn.email/content/guids/CABINET_67e080d830d87c17802bd9b4fe1c0912/images/55191618237638326.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="100"></td>
    </tr>
    <tr>
    <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-bottom:10px"><h1 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:46px;color:#333333">Shop Place Contact Mail</h1></td>
    </tr>
    <tr>
    <td align="left" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:5px;padding-right:40px;padding-bottom:5px;padding-left:40px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Sender:</span> 
    ${req.body.username}</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><span style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">E-Mail Address:</span> 
    ${req.body.email}</p></td>
    </tr>
    <tr>
    <td align="left" style="padding:0;Margin:0;padding-top:10px;padding-bottom:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">&emsp;
    ${req.body.description}</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">&nbsp;</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">&nbsp;</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">&nbsp;</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">&nbsp;</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">&nbsp;</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">&nbsp;</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">&nbsp;</p></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table></td>
    </tr>
    </table>
    <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
    <tr>
    <td align="center" style="padding:0;Margin:0">
    <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px">
    <tr>
    <td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-top:20px;padding-bottom:20px">
    <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
    <td align="left" style="padding:0;Margin:0;width:600px">
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
    <td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">ShopPlace © 2023</p></td>
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

        const info = await transporter.sendMail({
            to: process.env.NODE_MAIL,
            subject: `Mail From: ${req.body.email}`,
            html: htmlTemplate,
        });
        res.status(201).json({
            succeded: true,
            message: "The message was sent successfully"
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Mail could not be sent"
        });
    }
}

const MyOrderSendMail = async (req, res, next) => {
    const htmlTemplate = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New Message</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
<![endif]--><style type="text/css">#outlook a { padding:0;}.es-button { mso-style-priority:100!important; text-decoration:none!important;}a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important;}.es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all;}@media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important; text-align:left }
 .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important }
 .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important }
 tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important }
 .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important }
 .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }</style>
 </head> <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]--><table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA"><tr>
<td valign="top" style="padding:0;Margin:0"><table cellpadding="0" cellspacing="0" class="es-content es-visible-simple-html-only" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td class="es-stripe-html" align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" style="padding:20px;Margin:0"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
<td align="center" valign="top" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="https://xckbdl.stripocdn.email/content/guids/CABINET_83c79fe6710c9b2a88d2db353ad3b6f6/images/99411618298697800.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="100" height="99"></td> </tr><tr><td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-bottom:10px"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:36px;font-style:normal;font-weight:bold;color:#333333">Your order has been placed!</h1></td></tr><tr>
<td align="center" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:5px;padding-bottom:20px;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">
Hello ${res.locals.user.username}, we wanted to inform you that your order has been completed. We wish you a great day using it.&nbsp;</p> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">If you didn't place this order, please contact us.</p>
</td></tr> <tr><td align="center" style="padding:0;Margin:0"><span class="es-button-border" style="border-style:solid;border-color:#5c68e2;background:#5a96e4;border-width:2px;display:inline-block;border-radius:6px;width:auto"><a href="http://localhost:3000/MyProfile" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;padding:10px 30px 10px 30px;display:inline-block;background:#5a96e4;border-radius:6px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #5a96e4;padding-left:30px;padding-right:30px">Keep shopping</a></span></td></tr></table></td></tr></table></td></tr></table></td></tr></table>
 <table cellpadding="0" cellspacing="0" class="es-content es-visible-simple-html-only" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"><tr><td class="es-stripe-html" align="center" style="padding:0;Margin:0"><table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td class="esdev-adapt-off" align="left" style="padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
<td class="es-m-p0r" align="center" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-top:2px solid #efefef" role="presentation"><tr><td align="center" class="es-m-txt-r" style="padding:0;Margin:0;padding-top:15px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#333333">
The person who ordered: ${res.locals.user.username}</h3> <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"><br></p>
<h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#333333">
Order Amount: <strong>₺ ${req.body.orderSumPrice}</strong></h3></td></tr></table></td></tr></table></td></tr> <tr><td class="esdev-adapt-off" align="left" style="padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td class="es-m-p0r" align="center" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-top:2px solid #efefef" role="presentation"><tr>
<td align="left" class="es-m-txt-r" style="padding:0;Margin:0;padding-top:15px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#333333">
Shipping Address: ${req.body.shippingAdress} </h3></td></tr></table></td></tr></table> </td></tr><tr><td align="left" style="padding:20px;Margin:0"> <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:143px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr>
<td class="es-m-p0r es-m-p20b" align="center" style="padding:0;Margin:0;width:133px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://xckbdl.stripocdn.email/content/guids/CABINET_1154ef987a3f887ce59a7fdb008c50d6/images/17971617974647919.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="45" height="45"></td></tr> <tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">FREE <br>SHIPPING</p></td></tr></table></td>
<td class="es-hidden" style="padding:0;Margin:0;width:10px"></td></tr></table> <!--[if mso]></td><td style="width:143px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td class="es-m-p20b" align="center" style="padding:0;Margin:0;width:133px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://xckbdl.stripocdn.email/content/guids/CABINET_1154ef987a3f887ce59a7fdb008c50d6/images/80801617974647921.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="45" height="45"></td></tr> <tr>
<td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">EASY <br>PAYMENT</p></td></tr></table></td><td class="es-hidden" style="padding:0;Margin:0;width:10px"></td></tr></table> <!--[if mso]></td><td style="width:132px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr><td align="center" class="es-m-p20b" style="padding:0;Margin:0;width:132px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
<td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://xckbdl.stripocdn.email/content/guids/CABINET_1154ef987a3f887ce59a7fdb008c50d6/images/77861617974647919.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="45" height="45"></td></tr> <tr><td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">QUICK <br>RETURN</p></td></tr></table></td></tr></table> <!--[if mso]></td><td style="width:10px"></td>
<td style="width:132px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr><td align="center" style="padding:0;Margin:0;width:132px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://xckbdl.stripocdn.email/content/guids/CABINET_1154ef987a3f887ce59a7fdb008c50d6/images/59831617975283573.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="45" height="45"></td></tr> <tr>
<td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px">QUALITY ASSURANCE</p></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" class="es-footer es-visible-simple-html-only" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"><tr>
<td class="es-stripe-html" align="center" style="padding:0;Margin:0"><table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px" role="none"><tr><td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px"><table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0;width:600px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
<td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0"><table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><a target="_blank" href="https://www.facebook.com/login/?privacy_mutation_token=eyJ0eXBlIjowLCJjcmVhdGlvbl90aW1lIjoxNjk4NzcwMDI3LCJjYWxsc2l0ZV9pZCI6MjY5NTQ4NDUzMDcyMDk1MX0%3D" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img title="Facebook" src="https://xckbdl.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png" alt="Fb" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a>
 </td><td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><a target="_blank" href="https://twitter.com/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img title="Twitter" src="https://xckbdl.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png" alt="Tw" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
 <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><a target="_blank" href="https://www.instagram.com/accounts/login/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img title="Instagram" src="https://xckbdl.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
 <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://www.youtube.com/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img title="Youtube" src="https://xckbdl.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png" alt="Yt" width="32" height="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td></tr></table></td></tr><tr><td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#333333;font-size:12px">Shopping Place © 2023</p></td></tr></table></td></tr></table></td></tr></table> </td></tr></table></td></tr></table></div>
</body></html>
`
    try {
        //sadece gmail adreslerine gönderim var diğer adresler için koşullar koymam ve hesap açmam gerek.
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
            to: `${res.locals.user.email}`,
            subject: process.env.NODE_MAIL,
            html: htmlTemplate,
        });
        next();
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "Mail could not be sent",
        });
    }
}

const OrdersReceivedCreate = async (req, res) => {
    try {
        const ordersReceived = await OrdersReceived.create({
            orderProducts: JSON.parse(req.body.orderProducts),
            customer: req.body.customer,
            shippingAdress: req.body.shippingAdress,
            orderSumPrice: req.body.orderSumPrice
        })
        res.status(200).json({
            succeded: true,
            message: 'The order was successfully received',
            ordersReceived,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The order could not be received'
        })
    }
}

const GetOrderReceived = async (req, res) => {
    try {
        let ownerId = res.locals.user._id;
        const ordersReceived = await OrdersReceived.find({})
        let orderRecProduct = [];

        for (const owner of ordersReceived) {
            for (const ownerItem of owner.orderProducts) {
                if (ownerId.toString() === ownerItem.product.productOwner.toString()) {
                    let shippingProductİnfo = {
                        ShippingProducts: ownerItem,
                        ProductCustomer: owner.customer,
                        ShippingAdresscustomer: owner.shippingAdress,
                    }
                    orderRecProduct.push(shippingProductİnfo);
                }
            }
        }
        res.status(200).json({
            succeded: true,
            message: 'Received orders have been processed',
            product: orderRecProduct,
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The orders received could not be processed'
        })
    }
}

const GetOrderPlaced = async (req, res) => {
    try {
        let user = res.locals.user.username;
        const ordersPlaced = await OrdersReceived.find({ customer: user })
        res.status(200).json({
            succeded: true,
            message: 'The orders placed have been processed',
            ordersPlaced,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: "The orders placed could not be processed"
        })
    }
}

const OrderPlacedDelete = async (req, res) => {

    let { order, item } = req.query;

    try {
        const foundOrder = await OrdersReceived.findOne({ _id: order });

        if (!foundOrder) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }
        const updatedOrderProducts = foundOrder.orderProducts.filter(
            (data) => data.product._id.toString() !== item.toString()
        );

        if (updatedOrderProducts.length > 0) {
            const updatedOrder = await OrdersReceived.findOneAndUpdate(
                { _id: order },
                { orderProducts: updatedOrderProducts },
                { new: true }
            );
            res.status(200).json({
                success: true,
                message: 'The product canceled successfully',
                updatedOrder,
            });
        } else {
            await OrdersReceived.findByIdAndDelete({ _id: order })
            res.status(200).json({
                success: true,
                message: 'The all Orders canceled successfully'
            });
        }
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The product could not be canceled'
        })
        console.error(error);
    }
}



const FavoriteAdd = async (req, res) => {
    try {
        const userId = res.locals.user._id;
        const productId = req.body.productId;
        const productType = req.body.productType;

        const existingFavorite = await FavoriteProduct.findOne({ userId, productId, productType });

        if (existingFavorite) {
            res.status(400).json({
                succeeded: false,
                error: 'This product has already been added to the favorites.'
            });
        } else {
            const favoriteProduct = await FavoriteProduct.create({
                userId,
                productId,
                productType
            })
            res.status(200).json({
                succeded: true,
                message: 'The product has been added successfully',
                favoriteProduct,
            })
        }
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The product could not be added'
        })
    }
}


const GetAllFavoriteProducts = async (req, res) => {
    try {
        const userId = res.locals.user._id;
        const userFavorites = await FavoriteProduct.find({ userId });

        const favoriteProducts = [];

        for (const favorite of userFavorites) {
            const productType = favorite.productType;
            const productModel = mongoose.model(`${productType.toLowerCase()}product`);

            if (productModel) {
                const product = await productModel.findById(favorite.productId);
                if (product) {
                    favoriteProducts.push(product);
                }
            } else {
                res.status(404).json({
                    succeded: false,
                    error: 'The favorite products could not be found'
                })
            }
        }
        res.status(200).json({
            succeded: true,
            message: 'The favorite products have been successfully found',
            favoriteProducts
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The favorite products could not be found'
        })
    }
}


const FavoriteProductsDelete = async (req, res) => {
    try {
        const userId = res.locals.user._id;
        const productId = req.params.id;
        const userFavorites = await FavoriteProduct.find({ userId })

        for (const favorite of userFavorites) {
            if (favorite.productId.toString() === productId.toString()) {
                await FavoriteProduct.findByIdAndRemove(favorite._id)
                res.status(200).json({
                    succeeded: true,
                    message: "Successfully removed"
                });
                return;
            }
        }
        res.status(200).json({
            succeeded: true,
            message: 'The product has been removed from the favorites'
        });

    } catch (error) {
        res.status(500).json({
            succeded: false,
            error: 'The product could not be removed from the favorites'
        })
    }
}


export { GetHomeAllProducts, GetSellerAllProducts, WebsiteSendMail, MyOrderSendMail, OrdersReceivedCreate, GetOrderReceived, GetOrderPlaced, OrderPlacedDelete, FavoriteAdd, GetAllFavoriteProducts, FavoriteProductsDelete }