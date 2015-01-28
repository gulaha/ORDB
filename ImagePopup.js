function ImagePopup( module ) {
    "use strict";
            
    function Slide ( filename, active) {
        this.filename = filename;
        this.active = active;
    }

    this.ImagePopupController = function($scope, $modalInstance, slides) {
        $scope.slides = slides;                

        //$scope.image = (filename.search(".jpg") > 1);
        //if(filename.search(".jpg") < 0) {
        //    $scope.youtubelink = "//www.youtube.com/embed/" + filename;                
        //} else {
        //    $scope.youtubelink = "";                
        //}
        $scope.close = function() {
            $modalInstance.close();
        };
    };
  
    this.open = function( $modal, mediafiles, selectedFilename ) {
        
        var slides = [];
        for (var i = 0; i < mediafiles.length; i++) { 
            slides.push(  
                new Slide(
                    mediafiles[i].filename,
                    mediafiles[i].filename == selectedFilename) );
        }

        $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: "",
            resolve: {
                slides: function () { return slides; }
            }
        });
    };

    module.controller('ModalInstanceCtrl', this.ImagePopupController );            
}
