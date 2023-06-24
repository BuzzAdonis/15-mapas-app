import { HttpClient, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn:'root'
})
export class DirectcionApiClient extends HttpClient{
    private urlBaseMapBox = environment.urlDirection;
    private keyMapBox     = environment.keyMapBox;

    constructor(handle:HttpHandler){
        super(handle);
    }

    public override get<T>(url: string){
        url = this.urlBaseMapBox + url;
        return super.get<T>(url,{
            params:{
                alternatives:false,
                geometries  :'geojson',
                language    :'es',
                overview    :'simplified',
                steps       :false,
                access_token:this.keyMapBox
            }
        });
    }
}