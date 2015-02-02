/// <reference path="..\..\typings\angularjs\angular.d.ts" />
/// <reference path="imagepopup.ts" />

enum AlertEnum {Success=0, Info=1, Warning=2, Danger=3};
class Alert {
    constructor( private type: AlertEnum, private text: string, private isHtml: boolean = false ) {
    }
    
    success() : boolean {
        return this.type == AlertEnum.Success;
    }
    info() : boolean {
        return this.type == AlertEnum.Info;
    }
    warning() : boolean {
        return this.type == AlertEnum.Warning;
    }
    danger() : boolean {
        return this.type == AlertEnum.Danger;
    }
    
}

class Alerts {
    alerts: Alert[];
    constructor(private $sce: ng.ISCEService){
        this.alerts=[];
    }
    Add(type: AlertEnum, text: string, isHtml: boolean = false) {
        if( isHtml) {
            this.alerts.push( new Alert( type, this.$sce.trustAsHtml(text), true ));        
        } else {
            this.alerts.push( new Alert( type, text ));        
        }
    }
    Remove( item: Alert ) { 
        var index = this.alerts.indexOf(item)
        this.alerts.splice(index, 1);     
    }    
}

class Route {
    name: string;
    description: string;
    length: number;
    grade: string;
    constructor(name: string="", description: string="", length: number=null, grade: string="") {
        this.name = name;
        this.description = description;
        this.length = length;
        this.grade = grade;
    }
}

class ImageFile implements IMediaFile{
    exist: boolean;
    thumbnail: string;
    filename: string;

    constructor(filename:string) {
        this.exist = true;
        this.thumbnail = filename;
        this.filename = filename;
    }
}

class MovieLink implements IMediaFile {
    exist: boolean;
    thumbnail: string;
    filename: string;
    
    constructor(thumbnail: string, filename: string) {
        this.exist = true;
        this.thumbnail = thumbnail;
        this.filename = filename;
    }
}

class ErrorManagedResult<T> {
    success: T;
    error: string;
}

class ErrorManagedHttpService {
    constructor(private $http: ng.IHttpService, private alerts: Alerts) {
    }
    
    post<T>(
        url: string, 
        data: any, 
        successCallback: ng.IHttpPromiseCallback<T>, 
        errormsg: string,
        errorCallback: ng.IHttpPromiseCallback<any>
    ) : void {
        this.$http.post<string>(url, data).
            success( (data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                if( typeof data == "string" ) {
                    if( data.indexOf("xdebug-error") >0 ) {
                        this.alerts.Add( AlertEnum.Danger, data, true );
                        errorCallback(data, status, headers, config);
                    } else {
                        this.alerts.Add( AlertEnum.Danger, data, false );
                        errorCallback(data, status, headers, config);
                    }
                } else {
                    var result: ErrorManagedResult<T> = data;
                    if( result.error ) {
                        this.alerts.Add(AlertEnum.Danger, errormsg + result.error);
                        errorCallback(result.error, status, headers, config);
                    } else {                    
                        successCallback(result.success, status, headers, config);
                    } 
                }
            }).
            error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                this.alerts.Add(AlertEnum.Danger, "Unexpected server error: " + data );
                errorCallback(data.error, status, headers, config);
            });
        
    }
}
    
    
interface IMediaFile {
    exist: boolean;
    thumbnail: string;
    filename: string;
}

enum UiModeEnum {Overview=0, RouteForm=1};
interface IMainScope extends ng.IScope {
    uiMode: UiModeEnum;
    alerts: Alerts;
    
    map: any;    
    waysup: Route[];
    place: string;
    crag: string;
    description: string;
    mediaFiles: IMediaFile[];

    newRoute: Route;
    
    thumbnailClick(filename: string);
    newRouteClick();
    newRouteSubmit();
    newRouteCancel();
}

class MainController {
    private scope: IMainScope;
    private modal: any;
    private http: ErrorManagedHttpService;
    
    constructor(private $scope: IMainScope, $modal, $http: ng.IHttpService, $sce: ng.ISCEService ) {
        // 59.408507, 15.087064
        var placePos = { latitude: 59.408507, longitude: 15.087064 };
        var marker = {
            latitude: 59.408507, 
            longitude: 15.087064,
            id: "DummyID"
        };

        $scope.map = { 
            center: placePos,
            markers: [marker],
            zoom: 12,
            options: { scrollwheel: false }
        };

        var page = "service/main.php";
        $http.get<Route[]>(page)
        .success(function(response) {$scope.waysup = response;});
        
        $scope.place = "Rosendal";
        $scope.crag = "Ravinen norra sidan";
        $scope.description = "Ravinens norra sida är svagt överhängande. Klippan är mycket uppbruten och flertalet leder är därför naturliga eller med stödbulning. Se upp för lösa delar på klippan.";
        $scope.mediaFiles = [
            new ImageFile("media/1.jpg"),
            new ImageFile("media/2.jpg"),
            new ImageFile("media/3.jpg"),
            new ImageFile("media/4.jpg")
            //new MovieLink("https://i.ytimg.com/vi/5XkHZx1wLsk/mqdefault.jpg",
            //              "5XkHZx1wLsk")
        ];
        $scope.newRoute = null;
        $scope.uiMode = UiModeEnum.Overview;
        $scope.alerts = new Alerts( $sce );
        
        $scope.thumbnailClick = (filename: string) => {this.OpenImageModal(filename)};
        $scope.newRouteClick = () => {this.ShowNewRouteForm()};
        $scope.newRouteSubmit = () => {this.NewRouteSubmit()};
        $scope.newRouteCancel = () => {this.NewRouteCancel()};
        
        this.scope = $scope;
        this.modal = $modal;
        this.http = new ErrorManagedHttpService( $http, this.scope.alerts );
    }
    
    OpenImageModal(filename: string) : void {
        imageModal.open(this.modal, this.scope.mediaFiles, filename);
    }
    
    ShowNewRouteForm() : void {
        this.scope.newRoute = new Route();
        this.scope.uiMode = UiModeEnum.RouteForm;
    }
    
    NewRouteSubmit() : void {
        
        this.http.post<Route>(
            "service/saveroute.php", 
            this.scope.newRoute,
            (data: Route) => {
                this.scope.waysup.push( data );
                this.scope.uiMode = UiModeEnum.Overview;
                this.scope.newRoute = null;
            },
            "Systemet misslyckades med att spara den nya leden.",
            () => {
                this.scope.uiMode = UiModeEnum.Overview;
                this.scope.newRoute = null;
            });

    }
    
    NewRouteCancel() : void {
        this.scope.uiMode = UiModeEnum.Overview;
        this.scope.newRoute = null;
    }
    
    
}


//var module: ng.IModule = angular.module("main", ['ui.bootstrap', 'uiGmapgoogle-maps']);
var app = angular.module("main", ['ui.bootstrap', 'uiGmapgoogle-maps']);

var imageModal: any = new ImagePopup( app );

app.controller("mainController", MainController );

