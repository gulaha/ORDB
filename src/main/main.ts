/// <reference path="..\..\typings\angularjs\angular.d.ts" />
/// <reference path="imagepopup.ts" />

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

interface IMediaFile {
    exist: boolean;
    thumbnail: string;
    filename: string;
}

enum UiModeEnum {Overview=0, RouteForm=1};
interface IMainScope extends ng.IScope {
    map: any;
    waysup: Route[];
    place: string;
    crag: string;
    description: string;
    mediaFiles: IMediaFile[];
    thumbnailClick(filename: string);
    newRoute: Route;
    uiMode: UiModeEnum;

    newRouteClick();
    newRouteSubmit();
    newRouteCancel();
}

class MainController {
    private scope: IMainScope;
    private modal: any;
    
    constructor(private $scope: IMainScope, $modal, $http: ng.IHttpService) {
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

        var site = "http://10.0.0.8/ordb/";
        var page = "main.php";
        $http.get<Route[]>(site + page)
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
        
        $scope.thumbnailClick = (filename: string) => {this.OpenImageModal(filename)};
        $scope.newRouteClick = () => {this.ShowNewRouteForm()};
        $scope.newRouteSubmit = () => {this.NewRouteSubmit()};
        $scope.newRouteCancel = () => {this.NewRouteCancel()};
        
        this.scope = $scope;
        this.modal = $modal;
    }
    
    OpenImageModal(filename: string) : void {
        imageModal.open(this.modal, this.scope.mediaFiles, filename);
    }
    
    ShowNewRouteForm() : void {
        this.scope.newRoute = new Route();
        this.scope.uiMode = UiModeEnum.RouteForm;
    }
    
    NewRouteSubmit() : void {
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

