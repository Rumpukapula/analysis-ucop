var analysisApp = angular.module('analysisApp', [
	'ui.bootstrap'
]);

analysisApp.controller('body', function($scope, $modal, $log) {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var canvas_left = canvas.offsetLeft;
	var canvas_top = canvas.offsetTop;
	
	$scope.selectedService = {};
	
	$scope.constants = {
		
	};
	
	$scope.contacts = [
		{
			'name':'Rudi Belli',
			'phone':'0400 123456',
			'email':'rudi.belli@teknik.fi'
		},
		{
			'name':'Ruokala Täti',
			'phone':'0700 123123',
			'email':'ruokaka@safkaa.fi'
		},
		{
			'name':'Sähkömies',
			'phone':'555-123-456',
			'email':'sahko@energiaa.fi'
		}
	];
	
	$scope.othServices = [
		{
			'location':'Helsinki',
			'description':'Energiayhtiö',
			'contact': $scope.contacts[2],
			'requirements':[]
		}
	];
	
	$scope.othServices.push(
		{
			'location':'Helsinki',
			'description':'Catering-yritys',
			'contact': $scope.contacts[1],
			'requirements':[$scope.othServices[0]]
		}
	);
	
	$scope.ownServices = [
		{
			'location': 'Helsinki',
			'description': 'Tekniikan laitos',
			'contact': $scope.contacts[0],
			'requirements': [$scope.othServices[0],$scope.othServices[1]] // add service & system requirements here (list of services)
		},
		{
			'location': 'Tampere',
			'description': 'Höpölaitos',
			'contact': $scope.contacts[0],
			'requirements': [$scope.othServices[1]] // add service & system requirements here (list of services)
		},
		{
			'location': 'Rovaniemi',
			'description': 'Kovalaitos',
			'contact': $scope.contacts[0],
			'requirements': [] // add service & system requirements here (list of services)
		}
	];
	
	$scope.incidents = [
		{
			'description':'Powerline destruction',
			'occurred': new Date(2014,10,18,8,30,0,0),
			'affectedSystem': $scope.othServices[0],
			//'magnitude':5,	// this could be a value between 0-9 or something
			//'duration':72, 	// in hours
			//'trend':0, 		// value from [-1,0,1]
			//'effect':'', 		// descriptive or numeral?
			'contact':$scope.othServices[0].contact,
			'icon':'img/icon_power_outage.png'
		}
	];
	$scope.incidents.push(
		{
			'description':'Power outage',
			'occurred': new Date(2014,11,5,9,0,0,0),
			'affectedSystem': $scope.ownServices[0],
			//'magnitude':5,	// this could be a value between 0-9 or something
			//'duration':72, 	// in hours
			//'trend':0, 		// value from [-1,0,1]
			//'effect':'', 		// descriptive or numeral?
			'contact':$scope.ownServices[0].contact,
			'icon':'img/icon_power_outage.png'
		}
	);
	
	$scope.configure = function() {
		var modalInstance = $modal.open({
			templateUrl: 'html/configure.html',
			controller: 'configure',
			size: 'lg',
			resolve: {
				'ownServices': function() { return $scope.ownServices; }
			}
		});

		modalInstance.result.then(function() {
			
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	function initOwnServicePositions() {
		for(var i = 0; i < $scope.ownServices.length; i++) {
			var service = $scope.ownServices[i];
			var angle = (i/$scope.ownServices.length)*2*Math.PI;
			service.drawPosition = {'angle':angle};
		}
	}
	
	function updateOwnServices() {
		// update own service positions		
		for(var i = 0; i < $scope.ownServices.length; i++) {
			var service = $scope.ownServices[i];
			
			if(service.drawPosition==undefined) {
				initOwnServicePositions();
				break;
			} else {
				service.drawPosition.angle += Math.PI*0.003
				if(service.drawPosition.angle > 2*Math.PI) {
					service.drawPosition.angle = 0;
				}
			}
		}
	}
	
	function initOthServicePositions() {
		for(var i = 0; i < $scope.othServices.length; i++) {
			var service = $scope.othServices[i];
			var angle = (i/$scope.othServices.length)*2*Math.PI;
			service.drawPosition = {'angle':angle};
		}
	}
	
	function updateOthServices() {
		// update other service positions		
		for(var i = 0; i < $scope.othServices.length; i++) {
			var service = $scope.othServices[i];
			
			if(service.drawPosition==undefined) {
				initOthServicePositions();
				break;
			} else {
				service.drawPosition.angle -= Math.PI*0.001
				if(service.drawPosition.angle > 2*Math.PI) {
					service.drawPosition.angle = 0;
				}
			}
		}
	}
	
	/*
	function drawOuterWorld() {
		var current_x = 0;
		var current_y = $scope.constants.outerWorld.start_y;
		var screen_height_per_system = $scope.constants.outerWorld.max_height;
		// outer world
		ctx.fillStyle = '#0000FF';
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#FF00FF';
		ctx.beginPath();
		ctx.rect(current_x,current_y,canvas.width,screen_height_per_system);
		ctx.fill();
		ctx.stroke();
	}
	*/
	
	function drawOwnServices() {
		// system styling
		
		var center_x = canvas.width / 2;
		var center_y = canvas.height / 2;
		var ring_r = 50;
		// center node
		ctx.fillStyle = '#000000';
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#000000';
		ctx.beginPath();
		ctx.arc(center_x,center_y,10,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		
		// translate own services to center
		ctx.translate(center_x,center_y);
		
		
		ctx.fillStyle = '#FF0000';
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#00FF00';
		
		var max = $scope.ownServices.length;
		
		for(var i = 0; i < $scope.ownServices.length; i++) {
			var service = $scope.ownServices[i];
			
			ctx.beginPath();
			ctx.arc(Math.cos(service.drawPosition.angle)*ring_r, 
					Math.sin(service.drawPosition.angle)*ring_r,
					10,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
		
		// reverse translate
		ctx.translate(-center_x,-center_y);
	}
	
	/*
	function drawServiceDescription(service,text_x,text_y) {
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
			
		if($scope.selectedService==service) {
			ctx.strokeStyle = '#00FF00';
		} else {
			ctx.strokeStyle = '#666666';
		}
		
		// write description
		ctx.font='20px Arial';
		ctx.fillText(service.description, text_x, text_y);
		
		// draw selectbox
		var select_width = ctx.measureText(service.description).width+10;
		var select_height = 40;
		var select_x = text_x-(select_width/2);
		var select_y = text_y-20;
		ctx.beginPath();
		ctx.rect(select_x, select_y, select_width, select_height);
		service.headerPosition.left=select_x;
		service.headerPosition.top=select_y;
		service.headerPosition.width=select_width;
		service.headerPosition.height=select_height;
		ctx.stroke();
		
		// write location
		text_y += 12;
		ctx.font='12px Arial';
		ctx.fillText("("+service.location+")", text_x, text_y);
	}
	*/
	
	function drawOthServices() {
		// system styling
		var center_x = canvas.width / 2;
		var center_y = canvas.height / 2;
		var ring_r = 300;
		
		
		// translate oth services to center
		ctx.translate(center_x,center_y);
		
		
		ctx.fillStyle = '#000000';
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#FFFF00';
		
		var max = $scope.othServices.length;
		
		for(var i = 0; i < $scope.othServices.length; i++) {
			var service = $scope.othServices[i];
			
			ctx.beginPath();
			ctx.arc(Math.cos(service.drawPosition.angle)*ring_r, 
					Math.sin(service.drawPosition.angle)*ring_r,
					10,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
		
		// reverse translate
		ctx.translate(-center_x,-center_y);
	}
	
	/*
	function drawIncidents() {
		for(var i = 0; i < $scope.incidents.length; i++) {
			var incident = $scope.incidents[i];
			
			for(var j = 0; j < $scope.services.length; j++) {
				if($scope.services[j]==incident.affectedSystem) {
					
				}
			}
			
			for(var j = 0; j < $scope.ownSystems.length; j++) {
				if($scope.ownSystems[j]==incident.affectedSystem) {
					ctx.strokeStyle = '#000000';
					
					ctx.translate(0,0);
					
					ctx.beginPath();
					ctx.moveTo(0,-10);
					ctx.lineTo(5,0);
					ctx.lineTo(0,10);
					ctx.lineTo(-5,0);
					ctx.lineTo(0,-10);
					ctx.stroke();
					
					// we translated the canvas to fit the incident context
					// we reset the transform matrix so nothing funny happens :)
					ctx.setTransform(1,0,0,1,0,0);
				}
			}
		}
	}
	*/
	
	function mainLoop() {
		var beginTime = new Date().getTime();
		
		// reset identity matrix
		ctx.setTransform(1,0,0,1,0,0);
		// clear canvas
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		
		// update services and incidents
		updateOwnServices();
		updateOthServices();
		
		// draw elements
		//drawOuterWorld();
		drawOwnServices();
		drawOthServices();
		//drawIncidents();
		
		/*
		* Calculate frame execution time and calculate
		* required additional delay to keep fps at 30
		*/
		var endTime = new Date().getTime();
		var delay = 33 - (endTime - beginTime);
		if(delay < 0) delay = 0;
		
		// draw debug
		ctx.textAlign='start';
		ctx.fillStyle = "red";
		ctx.font = "10pt Arial";
		ctx.fillText  ("FPS : "+1000/(endTime - beginTime)+" (Limited to 30)", 10, 20);
		ctx.fillText  ("FPS Delay : "+delay, 10, 35);
		
		setTimeout(mainLoop, delay);
	}
	
	// setup
	// resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
		canvas.width = window.innerWidth - $('#services').outerWidth() - $('#incidents').outerWidth();
		canvas.height = window.innerHeight - $('#control-panel').outerHeight() - 30;

		/*
		* Your drawings need to be inside this function otherwise they will be reset when 
		* you resize the browser window and the canvas goes will be cleared.
		*/
		mainLoop(); 
    }
    resizeCanvas();
	
	// canvas event listeners (e.g. clicks)
	/*
	canvas.addEventListener('click', function(event) {
		var x = event.pageX - canvas_left;
		var y = event.pageY - canvas_top;
		
		var clickedServiceElement = false;
		for(var i = 0; i < $scope.services.length; i++) {
			var service = $scope.services[i];
			if(y > service.headerPosition.top && y < service.headerPosition.top + service.headerPosition.height && x > service.headerPosition.left && x < service.headerPosition.left + service.headerPosition.width) {
				clickedServiceElement = true;
				$scope.selectedService = service;
				$scope.$apply();
				break;
			}
		}
		
		if(!clickedServiceElement) {
			$scope.selectedService = {};
			$scope.$apply();
		}
	}, false);
	*/
});

analysisApp.controller('configure', function($scope, $modalInstance, ownServices) {
	$scope.services = ownServices;
	for(var i = 0; i < $scope.services.length; i++) {
		$scope.services[i].editing = false;
	}
	
	$scope.addNew = function() {
		$scope.services.push(
			{
				'location': '',
				'description': '',
				'contact': '',
				'requirements': [], // add service & system requirements here (list of services)
				'editing':true
			}
		);
	};
	
	$scope.edit = function(service) {
		service.editing = true;
	};
	
	$scope.save = function(service) {
		service.editing = false;
	};
	
	$scope.remove = function(service) {
		for(var i = 0; i < $scope.services.length; i++) {
			if($scope.services[i]==service) {
				$scope.services.splice(i,1);
				break;
			}
		}
	};
	
	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});