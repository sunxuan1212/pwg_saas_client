import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import DefaultClientAPI from '../index';

export const MIDDLETIER_URL = "http://localhost:3000/graphql";
// export const MIDDLETIER_URL = "http://15.165.150.23/graphql";

export const defaultImage_system = require("./noImageFound.png");


export const getAllProductCategory = (products) => {
  let result = [];
  products.map((aProduct)=>{
    if (aProduct.category && aProduct.category.length > 0) {
      aProduct.category.map((aCategory)=>{
        // let catKeys = Object.keys(aCategory)
        // if (catKeys.indexOf('key') >= 0) {
        //   console.log('aProduct', aProduct.name)
        // }
        let foundPushedItem = result.find((anItem)=>anItem._id == aCategory._id);
        if (!foundPushedItem) {
          result.push(aCategory);
        }
      })
    }
  });
  return result;
}

const handleConfigOuput = (config = null) => {
  let result = null;
  if (config) {
    result = {...config}
    let newDefaultImage = defaultImage_system;
    if (result.defaultImage && result.defaultImage != "") {
      newDefaultImage = result.imageSrc + result.defaultImage;
    }
    result['defaultImage'] = newDefaultImage;
  }
  return result;
}

// User Cache ---------------------------- start
const GET_USER_CACHE_QUERY = gql`
  query user {
    user @client {
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
const SET_USER_CACHE_QUERY = gql`
  query user {
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

export const useUserCache = () => {
  const  { data, error, loading } = useQuery(GET_USER_CACHE_QUERY,{
    fetchPolicy: 'cache-only'
  });

  let result = null;
  if (loading) {
    // console.log('loading');
  }
  if (error) {
    console.log('useUserCache',error);
  }
  if (data && data.user) {
    result = data.user;
  }
  return result;
}

export const setUserCache = (data, client=null) => {
  let theClient = DefaultClientAPI.client;
  if (client != null) {
    theClient = client;
  }
  theClient.writeQuery({
    query: SET_USER_CACHE_QUERY,
    data: {
      user: data
    }
  });
  // theClient.writeData({
  //   data: {
  //     user: data
  //   }
  // });
}

// export const getUserCache = (client=null) => {
//   let result = null;
//   let theClient = DefaultClientAPI.client;
//   if (client != null) {
//     theClient = client;
//   }
//   try {
//     result = theClient.readQuery({
//       query: GET_USER_CACHE_QUERY
//     },true)
//   }
//   catch (e) {
//     result = null;
//   }

//   return result;
// }


// User Cache ---------------------------- end
// Config Cache ---------------------------- start
const GET_USER_CONFIG_QUERY = gql`
  query userConfig($configId: String!) {
    userConfig(configId: $configId) {
        success
        message
        data
    }
  }
`
const GET_CONFIG_CACHE_QUERY = gql`
  query config {
    config @client {
      _id
      configId
      defaultImage
      defaultImage_system
      imageSrc
      paymentQRImage
      server
      profile {
        name
        notice
      }
      delivery
    }
  }
`
const SET_CONFIG_CACHE_QUERY = gql`
  query config {
    config {
      _id
      configId
      defaultImage
      defaultImage_system
      imageSrc
      paymentQRImage
      server
      profile {
        name
        notice
      }
      delivery
    }
  }
`
export const useConfigCache = () => {
  const { data, error, loading } = useQuery(GET_CONFIG_CACHE_QUERY,{
    fetchPolicy: 'cache-only'
  });

  let result = null;
  if (loading) {
    // console.log('loading');
  }
  if (error) {
    console.log('useConfigCache',error);
  }
  if (data && data.config) {
    result = data.config;
  }
  return result;
}

export const setConfigCache = (data, client=null) => {
  let theClient = DefaultClientAPI.client;
  if (client != null) {
    theClient = client;
  }
  theClient.writeQuery({
    query: GET_CONFIG_CACHE_QUERY,
    data: {
      config: handleConfigOuput(data)
    }
  });
  // theClient.writeData({
  //   data: {
  //     config: handleConfigOuput(data)
  //   }
  // });
}

// export const getConfigCache = (client=null) => {
//   let result = null;
//   let theClient = DefaultClientAPI.client;
//   if (client != null) {
//     theClient = client;
//   }
//   try {
//     result = theClient.readQuery({
//       query: SET_CONFIG_CACHE_QUERY
//     },true) 
//   }
//   catch (e) {
//     result = null;
//   }

//   return result;
// }

export const useConfigQuery = (input) => {
  // const [ getConfig, { data, error, loading } ] = useLazyQuery(GET_USER_CONFIG_QUERY,{
  const { data, error, loading } = useQuery(GET_USER_CONFIG_QUERY,{
    fetchPolicy: 'cache-and-network',
    variables: {
      configId: input
    },
    onCompleted: (result) => {
      if (result && result.userConfig && result.userConfig.success) {
        setConfigCache(result.userConfig.data)
      }
    }
  });
  let result = null;
  if (loading) {
    // console.log('loading');
  }
  if (error) {
    console.log('useConfigQuery',error);
  }
  if (data && data.userConfig) {
    result = handleConfigOuput(data.userConfig);
  }
  return result;
}
// Config Cache ---------------------------- end


// const GET_LOGGED_IN_USER = gql`
//   query loggedInUser{
//     loggedInUser{
//         success
//         message
//         data
//     }
//   }
// `
// export const useUserQuery = () => {
//   const [getUser, { data, error, loading }] = useLazyQuery(GET_LOGGED_IN_USER,{
//     //fetchPolicy: 'cache-and-network'
//   });

//   let result = null;
//   if (loading) {
//     console.log('loading');
//   }
//   if (error) {
//     console.log(error);
//   }
//   if (data && data.user) {
//     result = data.user;
//   }
//   return result;
// }