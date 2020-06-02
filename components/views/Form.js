export default () => `<form id="register" method="POST" action="">
<div>
  <label for="photoUrl">Photo URL:</label>
  <input type="text" name="photoUrl" id="photoUrl" placeholder="Enter Your URL Here">
</div>
<div>
  <label for="title">Description:</label>
  <input type="text" name="title" id="title" placeholder="Caption your photo">
</div>
<input type="submit" name="addPhoto" value="Add My Photo">
</form>`;
