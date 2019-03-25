/**
 * The apollo context.
 */
import getUser from './get-user';
import generateModels from './generate-models';

const apolloContext = async ({ req }) => {
  try {
    console.log('asdads');
    console.log(req.headers);
    req.user = await getUser({ req });
    console.log(req.user);
  } catch(e) {
    console.log('1212312313213');
    console.log(e);
  }

  console.log('ppppppppp');
  // add the user to the context
  return {
    user: req.user,
    models: generateModels({ req }),
  };
};

export default apolloContext;
