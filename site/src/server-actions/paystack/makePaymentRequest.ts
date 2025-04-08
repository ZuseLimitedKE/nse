import { Errors, MyError } from "@/constants/errors";
import "../../../envConfig";
import axios from "axios";

export async function makePaymentRequest(customer_email: string, amount: number): Promise<string> {
    try {
        const response = await axios.post(process.env.PAYSTACK_URL, {
            email: customer_email,
            amount: Math.ceil(amount * 100)
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
            }
        });

        if (!response.data.data.access_code) {
            console.log("Did not get access code from paystack", response);
            throw new MyError(Errors.NOT_MAKE_PAYMENT_REQUEST);
        } else {
            return response.data.data.access_code;
        }
    } catch(err) {
        if (err instanceof MyError) {
            if (err.message === Errors.NOT_MAKE_PAYMENT_REQUEST) {
                throw err;
            }
        }

        console.log("Unkown error", err);
        throw new MyError(Errors.UNKNOWN);
    }
}