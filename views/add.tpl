<h3>Add Waypoint!</h3>


<form class="form-horizontal" role="form" ng-submit="pushWaypoint()">
 	<div class="form-group">
		<input type="text" ng-model="TitleInput" placeholder="Title" />
	</div>
	<div class="form-group">
		<input type="text" ng-model="CodeInput" placeholder="Code" />
	</div>
	<div class="form-group">
		<input type="text" ng-model="ClueInput" placeholder="Clue" />
	</div>
	<div class="form-group">
		<input type="text" ng-model="InstructionInput" placeholder="Instruction" />
	</div>
	<div class="form-group">
		<input type="text" ng-model="LatInput" placeholder="Lat" />
	</div>
	<div class="form-group">
		<input type="text" ng-model="LonInput" placeholder="Lon" />
	</div>
	<div class="form-group">
		<input class="btn btn-success" type="submit" value="Push" />
	</div>
</form>