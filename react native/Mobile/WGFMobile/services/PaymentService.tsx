import axios from "axios";
import { BASE_URL } from "../const";
import { post } from "./common/http";

export const checkoutStripePayment = (data: any) => post(`${BASE_URL}/api/Settings/CheckoutPayment`, data);