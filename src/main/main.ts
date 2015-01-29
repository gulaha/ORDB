/// <reference path="..\..\typings\angularjs\angular.d.ts" />
/// <reference path="imagepopup.ts" />

var app: any;
app = angular.module("main", ['ui.bootstrap', 'uiGmapgoogle-maps']);

var imageModal: any = new ImagePopup( app );

app.controller("mainController", 
    function ($scope, $modal) {
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
        $scope.waysup = [
            new Wayup("Viktors sprajs", "10", "5"), 
            new Wayup("Björkleden", "12", "4+"), 
            new Wayup("Jojo", "9", "5+")];
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
        $scope.thumbnailClick = function(filename) {
            //var domElement = document.getElementById("ComponentControllerID");
            //var componentScope = angular.element(domElement).scope();
            //componentScope.SetImageFile(filename);
            imageModal.open($modal, $scope.mediaFiles, filename);
        };
    }
);

function Wayup(name, length, grade) {
    this.name = name;
    this.length = length;
    this.grade = grade;
}
function ImageFile(filename) {
    this.exist = true;
    this.thumbnail = filename;
    this.filename = filename;
}
function MovieLink(thumbnail, filename) {
    this.exist = true;
    this.thumbnail = thumbnail;
    this.filename = filename;
}
