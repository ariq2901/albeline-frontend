import Cookie from 'universal-cookie';
var cookies = new Cookie();
const config = {
  // api_host:'https://team-marketplace.herokuapp.com',
  api_host:'http://127.0.0.1:8000',
  bearer_token: `Bearer ${cookies.get('user_token')}`,
}
export {config};