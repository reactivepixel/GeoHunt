<div ng-show="unlocked" class="alert alert-success">Unlocked Next Waypoint</div>
	<article class="jumbotron" ng-repeat="waypoint in user.waypoints">
	  <div class="container">
	  	<aside class="pull-right col-lg-6">
			<a href="#/easy" class="">
		  		
				<table class="table table-bordered">
					<tr>
						<th>latitude</th>
						<th>longitude</th>
					</tr>
					<tr>
						<td>{{waypoint.lat}}</td>
						<td>{{waypoint.lon}}</td>
					</tr>
				</table>

	  		</a>

	  		<form class="form-inline" role="form">
		  <div class="form-group">
		    <label class="sr-only" for="exampleInputEmail2">Code</label>
		    <input type="text" class="form-control" placeholder="Found Code" ng-model="waypoint.FoundCodeInput" />
		  </div>
		 
		  <button type="submit" class="btn btn-default" ng-click="submitCode(waypoint.FoundCodeInput)">Submit Code</button>
		</form>
	  	</aside>
	    <h1 class="col-lg-6">{{waypoint.title}}</h1>
	    <dl class="col-lg-6">
			<dt>Clue</dt>
			<dd>{{waypoint.clue}}</dd>
		</dl>
		<dl class="col-lg-6">
			<dt>Instructions</dt>
			<dd>{{waypoint.instruction}}</dd>
		</dl>
		<!-- <p><input type="text" ng-model="CodeInput" /></p>
	    <p><a class="btn btn-primary btn-lg">Enter Code</a></p>
 -->
		


	  </div>
	</div>