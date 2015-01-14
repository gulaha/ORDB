var app = angular.module("main", ['ui.bootstrap', 'uiGmapgoogle-maps']);

var imageModal = new ImagePopup( app );

app.controller("mainController", 
    function ($scope, $modal) {
        // 59.408507, 15.087064
        var placePos = { latitude: 59.408507, longitude: 15.087064 };
        var marker = {
            latitude: 59.408507, 
            longitude: 15.087064
        };
        marker["id"] = "DummyID";

        $scope.map = { 
            center: placePos,
            markers: [marker],
            zoom: 12,
            options: { scrollwheel: false }
        };
        $scope.waysup = [
            new wayup("Viktors sprajs", "10", "5"), 
            new wayup("Björkleden", "12", "4+"), 
            new wayup("Jojo", "9", "5+")];
        $scope.place = "Rosendal";
        $scope.crag = "Ravinen norra sidan";
        $scope.description = "Ravinens norra sida är svagt överhängande. Klippan är mycket uppbruten och flertalet leder är därför naturliga eller med stödbulning. Se upp för lösa delar på klippan.";
        $scope.mediaFiles = [
            new imageFile("media/1.jpg"),
            new imageFile("media/2.jpg"),
            new imageFile("media/3.jpg"),
            new imageFile("media/4.jpg"),
            new movieLink("https://i.ytimg.com/vi/5XkHZx1wLsk/mqdefault.jpg",
                          "5XkHZx1wLsk"),
            new dummyFile()];
        $scope.ThumbnailClick = function(filename) {
            //var domElement = document.getElementById("ComponentControllerID");
            //var componentScope = angular.element(domElement).scope();
            //componentScope.SetImageFile(filename);
            imageModal.Open($modal, filename);

        };
    }
);

function wayup(name, length, grade) {
    this.name = name;
    this.length = length;
    this.grade = grade;
}
function imageFile(filename) {
    this.exist = true;
    this.thumbnail = filename;
    this.filename = filename;
}
function movieLink(thumbnail, filename) {
    this.exist = true;
    this.thumbnail = thumbnail;
    this.filename = filename;
}
function dummyFile() {
    this.exist = false;
    this.filename = "dummy";
}
