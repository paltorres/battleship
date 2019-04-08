/**
 * The apollo context.
 */
import validateUser from './validate-user';
import generateModels from './generate-models';


const apolloContext = async ({ req, connection }) => {
  let headers = {};
  if (connection) {
    headers = connection.context.headers;
  } else {
    headers = req.headers;
  }

  let user = null;
  try {
    user = await validateUser({ headers });
  } catch(e) {
    // if this fail do nothing, why? because no why
    console.log('Error validating user', e.response.status, e.response.data);
  }

  return {
    user,
    models: generateModels({ user }),
  };
};

export default apolloContext;
