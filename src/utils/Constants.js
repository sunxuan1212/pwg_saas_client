import gql from "graphql-tag";

import DefaultClientAPI from '../index';

export const MIDDLETIER_URL = "http://localhost:5003/graphql";

export const defaultImage = "https://mananml-resources.s3-us-west-2.amazonaws.com/images/HANDROLLINGACCESSORIES/SMOKING60PAPER-RED-2304X1536.jpg";

const GET_CONFIG_CACHE = gql`
  query ROOT_QUERY {
    config {
      _id
      configId
      defaultImage
      defaultImage_system
      imageSrc
      paymentQRImage
      server
    }
  }
`
const GET_LOGGEDINUSER_CACHE = gql`
  query ROOT_QUERY {
    user {
      success
      message
      data {
        _id
        username
        configId
      } 
    }
  }
`

const GET_USERCONFIG_QUERY = gql`
  query userConfig($configId: String!) {
    userConfig(configId: $configId) {
        success
        message
        data
    }
  }
`
const GET_LOGGEDINUSER_QUERY = gql`
  query loggedInUser{
    loggedInUser{
        success
        message
        data
    }
  }
`

export const setUser = (data) => {
  DefaultClientAPI.client.writeQuery({
    query: GET_LOGGEDINUSER_CACHE,
    data: {
      user: data
    }
  })
}
export const getUser = async () => {
  let result = null;
  const { user } = DefaultClientAPI.client.readQuery({
    query: GET_LOGGEDINUSER_CACHE,
  })
  if (user && user.success) {
    result = user;
  }
  else {
    await DefaultClientAPI.query(
      GET_CONFIG_CACHE
    ).then(({data})=>{
      if (data.loggedInUser.success) {
        setUser(data.loggedInUser)
        result = data.loggedInUser;
      }
      else {
        console.log('get logged in user  false')
      }
    }).catch(err=>{
      console.log('GET_LOGGEDINUSER_QUERY error', err)
    })
  }
  return result;
}


const handleConfigOuput = (config = null) => {
  let result = null;
  if (config) {
    result = Object.assign({},config);
    let defaultImage = config.defaultImage ? config.imageSrc + config.defaultImage : config.defaultImage_system
    result['defaultImage'] = defaultImage;
  }
  return result;
}

export const getConfig = async () => {
  let result = null;

  if (DefaultClientAPI) {
    const { config } = DefaultClientAPI.client.readQuery({
      query: GET_CONFIG_CACHE,
    })
    if (config) {
      console.log("found config cache")
      result = handleConfigOuput(config);
    }
    else {
      console.log("not found config cache, run query")

      let user = await getUser();
      if (user) {
        console.log('getConfig user',user)
        await DefaultClientAPI.query(
          GET_USERCONFIG_QUERY,
          {
            configId: user.data.configId
          }
        ).then(({data})=>{
          if (data.userConfig.success) {
            DefaultClientAPI.client.writeQuery({
              query: GET_CONFIG_CACHE,
              data: {
                config: data.userConfig.data
              }
            })
            result = handleConfigOuput(data.userConfig.data);
          }
          else {
            console.log('get config success false')
          }
        }).catch(err=>{
          console.log('GET_USERCONFIG_QUERY error', err)
        })
      }
    }
  }
  console.log('result',result)
  return result;
}
