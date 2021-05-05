
export interface HttpResponse {
    status: boolean,
    msg: string,
    statusText: string,
    httpCode: number,
    data: any
};

export interface SimpleResponse {
    status: boolean,
    msg: string,
}