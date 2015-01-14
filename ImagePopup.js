        function ImagePopup( module ) {
            
            this.ImagePopupController = function($scope, $modalInstance, filename) {
                $scope.filename = filename;                
                $scope.image = (filename.search(".jpg") > 1);
                if(filename.search(".jpg") < 0) {
                    $scope.youtubelink = "//www.youtube.com/embed/" + filename;                
                } else {
                    $scope.youtubelink = "";                
                }
                $scope.close = function() {
                    $modalInstance.close();
                }
            }
                
            this.Open = function( $modal, filename ) {
                
                $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: "",
                    resolve: {
                        filename: function () {
                          return filename;
                        }
                    }
                });
            }
            
            module.controller('ModalInstanceCtrl', this.ImagePopupController );            
        }
