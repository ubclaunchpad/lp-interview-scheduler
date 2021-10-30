import { sha3_256 } from "js-sha3";

// export function createHash(
//     lead1: string,
//     lead2: string,
//     intervieweeEmail: string
// ) {
//     return lead1 + lead2 + intervieweeEmail;
// }



function hash(prev: string, curr: string): string {
    return prev + sha3_256(curr).toString();
}

export function createHash(intervieweeEmail: string, leads: string[], endDate: string): string {
    const emailHash: string = sha3_256(intervieweeEmail).toString();
    const leadsHash: string = leads.reduce(hash);
    const dateHash: string = sha3_256(endDate).toString();

    return sha3_256(emailHash + leadsHash + dateHash).toString();
}

export function createHashJson(obj: any): string {
    const keys:string[] = obj.keys;
    const concHash:string = keys.reduce((prev, curr) => prev + sha3_256(obj[curr]).toString(), "");
    return String(sha3_256(concHash));
}
