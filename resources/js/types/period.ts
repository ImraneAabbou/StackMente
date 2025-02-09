import { DAILY, WEEKLY, MONTHLY, YEARLY, TOTAL } from "@/Enums/Period";

export type Period =
    | typeof DAILY
    | typeof WEEKLY
    | typeof MONTHLY
    | typeof YEARLY
    | typeof TOTAL;
