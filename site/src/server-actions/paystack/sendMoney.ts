"use server"

import "../../../envConfig";
import { Errors, MyError } from "@/constants/errors";
import axios from "axios"

interface CreateTransferReceipt {
    customer_name: string,
    customer_phone_number: string, // Not start with 254
    customer_email: string,
}


async function getRecepientCode(args: CreateTransferReceipt): Promise<string> {
    if (!process.env.PAYSTACK_SECRET) {
        console.log("Set paystack secret in env variables");
        throw new MyError(Errors.INVALID_SETUP);
    }

    try {
        const response = await axios.post("https://api.paystack.co/transferrecipient", {
            type: "mobile_money",
            name: args.customer_name,
            account_number: args.customer_phone_number,
            bank_code: "MPESA",
            currency: "KES"
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        });

        if (!response.data.data.recipient_code) {
            console.log("Recepient code not returned", response);
            throw new MyError(Errors.NOT_GET_RECEPIENT_CODE);
        } else {
            return response.data.data.recipient_code;
        }
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.NOT_GET_RECEPIENT_CODE) {
                throw err;
            }
        }

        console.log("Unkown error", err);
        throw new MyError(Errors.UNKNOWN);
    }
}

(async() => {
    const recepient_code = await getRecepientCode({customer_email: "roman.njoroge@njuguna.com", customer_name: "Roman Njoroge", customer_phone_number: "0702735922"})
    console.log(recepient_code)
})();