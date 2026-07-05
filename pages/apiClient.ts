import { APIRequest, APIRequestContext } from "@playwright/test";
export class ApiClient{
    constructor (private request: APIRequestContext){}
    async getPostcode(country: string, postcode: string){
        return await this.request.get(`https://api.zippopotam.us/${country}/${encodeURIComponent(postcode)}`);
        }}
