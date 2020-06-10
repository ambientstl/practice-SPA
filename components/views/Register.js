export default () => `
<section id="register">
  <form action="" method="POST">
    <label for="userName">Username: </label>
    <input type="text" name="userName" id="userName" placeholder="Username">

    <label for="email">Email: </label>
    <input type="email" name="email" id="email" placeholder="your@email.here">

    <label for="password">Password: </label>
    <input type="password" name="password" id="password">

    <input type="submit" id="register-button" value="Register">
  </form>
</section>
`;
