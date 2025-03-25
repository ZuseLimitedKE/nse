import { Errors, MyError } from "@/constants/errors";
import "../../../envConfig";
import axios from "axios";

export async function makePaymentRequest(customer_email: string, amount: number): Promise<string> {
    try {
        const response = await axios.post(process.env.PAYSTACK_URL, {
            email: customer_email,
            amount: amount
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
        console.log("Error making payment request");
        throw new MyError(Errors.NOT_MAKE_PAYMENT_REQUEST);
    }
}

(async () => {
    const access_code = await makePaymentRequest("roman.njoroge@njuguna.com", 1);
    console.log(access_code);
})()