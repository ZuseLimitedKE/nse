"use server"

import  {EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import "../../../envConfig";
import { Errors, MyError } from "@/constants/errors";
import { NotifySend } from "@/constants/types";

export async function sendNotification(args: NotifySend) {
    try {
        if (!process.env.MAILERSEND || !process.env.NOTIFIER_MAIL) {
            console.log("Set MAILERSEND and NOTIFIER_MAIL in env variables");
            throw new MyError(Errors.INVALID_SETUP);
        }

        const mailersend = new MailerSend({
            apiKey: process.env.MAILERSEND,
        });
        
        const recipients = [new Recipient(process.env.NOTIFIER_MAIL, "Recipient")];
        
        const emailParams = new EmailParams()
        .setFrom(new Sender("notifications@trial-68zxl27rqke4j905.mlsender.net"))
        .setHtml(`
            <h1>New Payment request</h1>
            <p>${args.customer_phone_number} has created a sell request for ${args.amount} shillings</p>    
        `)
        .setTo(recipients)
        .setSubject("New sell request")
        
        await mailersend.email.send(emailParams);
    } catch(err) {
        console.log("Error sending notification", err);
    }
}