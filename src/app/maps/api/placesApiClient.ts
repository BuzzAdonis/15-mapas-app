import { MapBoxRespose } from './../interfaces/map-box-respose.interface';
import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn:'root'
})
export class MapBoxApiClient extends HttpClient{
    private urlBaseMapBox = environment.urlBaseMapBox;
    private keyMapBox     = environment.keyMapBox;

    constructor(handle:HttpHandler){
        super(handle);
    }

    public override get<T>(url: string,
        options:{
            params?: HttpParams | {
                [param:string]: string| number | boolean | ReadonlyArray<string | number | boolean>
            };
        }
        ){
        url = this.urlBaseMapBox + url;
        return super.get<T>(url,{
            params:{
                limit:5,
                language:'es',
                access_token:this.keyMapBox,
                ...options.params
            }
        });
    }
}