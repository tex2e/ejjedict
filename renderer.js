
const fs = require('fs');
const path = require('path');

angular.module('MyDict', [])
  .controller('MyDictController', ["$scope", function ($scope) {
    $scope.searchWord = "";
    $scope.resultDefaultLimit = 20; // const
    $scope.resultLimit = $scope.resultDefaultLimit;
    $scope.ejDict = [];
    $scope.jeDict = [];
    $scope.result = [];
    $scope.isResultOverflow = false;

    // Load an english-japanese dictionary file
    fs.readFile(path.join(__dirname, "data/ejdic/ejdic.txt"), "utf-8", function (err, data) {
      if (err) {
        if (err.code === "ENOENT") {
          console.error('file does not exist');
          return;
        } else {
          throw err;
        }
      } else {
        $scope.ejDict = data.split("\n");
      }
    });
    // Load a japanese-english dictionary file
    fs.readFile(path.join(__dirname, "data/edict/edict.txt"), "utf-8", function (err, data) {
      if (err) {
        if (err.code === "ENOENT") {
          console.error('file does not exist');
          return;
        } else {
          throw err;
        }
      } else {
        $scope.jeDict = data.split("\n");
      }
    });

    $scope.resetLimit = function () {
      $scope.resultLimit = $scope.resultDefaultLimit;
    };

    $scope.liftLimit = function () {
      $scope.resultLimit *= 2;
    };

    $scope.computeResult = function () {
      var searchRegexp = ($scope.searchWord === "")
        ? new RegExp("^$")
        : new RegExp("^" + $scope.searchWord);

      // $scope.dict
      var filteredDict = $scope.ejDict.concat($scope.jeDict).filter(function (item) {
        return item.match(searchRegexp);
      })
      var result = filteredDict
        .slice(0, $scope.resultLimit)
        .map(function (item) {
          var tmp = item.split(/\t| \//);
          var hash = { name: tmp[0], desc: tmp[1] };
          return hash;
        })

      $scope.isResultOverflow = (filteredDict.length > $scope.resultLimit);
      $scope.result = result;
      return result;
    };

    // When reach at the bottom, show more results.
    $(window).scroll(function () {
      if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        // console.log("bottom!");
        $scope.liftLimit();
        $scope.computeResult();
        $scope.$apply();
      }
    })

    $(window).keydown(function(event) {
      // When Ctrl + F, select the search box.
      if ((event.ctrlKey || event.metaKey) && event.keyCode === 70) {
        event.preventDefault();
        $(window).scrollTop(0);
        $("#searchWord").select();
      }
      // When Entered, select the search box.
      if (event.keyCode === 13) {
        $("#searchWord").select();
      }
    });

    console.log($scope);
  }])
