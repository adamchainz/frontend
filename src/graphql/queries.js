import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment';
import LoggedInUser from '../classes/LoggedInUser';
import storage from '../lib/storage';
import * as api from '../lib/api';

export const transactionFields = `
  id
  uuid
  description
  createdAt
  type
  amount
  currency
  netAmountInCollectiveCurrency
  hostFeeInHostCurrency
  platformFeeInHostCurrency
  paymentProcessorFeeInHostCurrency
  paymentMethod {
    service
  }
  fromCollective {
    id
    name
    slug
    image
  }
  host {
    id
    name
    currency
  }
  ... on Expense {
    category
    attachment
  }
  ... on Order {
    createdAt
    subscription {
      interval
    }
  }
`;

export const getTransactionsQuery = gql`
query Transactions($CollectiveId: Int!, $type: String, $limit: Int, $offset: Int, $dateFrom: String, $dateTo: String) {
  allTransactions(CollectiveId: $CollectiveId, type: $type, limit: $limit, offset: $offset, dateFrom: $dateFrom, dateTo: $dateTo) {
    ${transactionFields}
    refundTransaction {
      ${transactionFields}
    }
  }
}
`;

export const getLoggedInUserQuery = gql`
  query LoggedInUser {
    LoggedInUser {
      id
      username
      firstName
      lastName
      email
      paypalEmail
      image
      CollectiveId
      collective {
        id
        name
        type
        slug
        settings
        paymentMethods(limit: 5) {
          id
          uuid
          service
          name
          data
        }
      }
      memberOf {
        id
        role
        collective {
          id
          slug
          type
          name
          currency
          stats {
            id
            balance
          }
          paymentMethods(limit: 5) {
            id
            uuid
            name
            service
            data
            balance
          }
        }
      }
    }
  }
`;

const getTiersQuery = gql`
  query Collective($slug: String!) {
    Collective(slug: $slug) {
      id
      slug
      name
      image
      backgroundImage
      twitterHandle
      description
      currency
      settings
      tiers {
        id
        type
        name
        description
        amount
        currency
        interval
      }
    }
  }
`;

const getCollectiveToEditQuery = gql`
  query Collective($slug: String!) {
    Collective(slug: $slug) {
      id
      type
      slug
      createdByUser {
        id
      }
      name
      company
      image
      backgroundImage
      description
      longDescription
      twitterHandle
      website
      currency
      settings
      createdAt
      isHost
      stats {
        id
        yearlyBudget
        backers {
          all
        }
        totalAmountSent
      }
      tiers {
        id
        slug
        type
        name
        description
        amount
        presets
        interval
        currency
        maxQuantity
      }
      memberOf {
        id
        createdAt
        role
        stats {
          totalDonations
        }
        tier {
          id
          name
        }
        collective {
          id
          type
          slug
          name
          currency
          description
          settings
          image
          stats {
            id
            backers {
              all
            }
            yearlyBudget
          }
        }
      }
      members(roles: ["ADMIN", "MEMBER"]) {
        id
        createdAt
        role
        description
        stats {
          totalDonations
        }
        tier {
          id
          name
        }
        member {
          id
          name
          image
          slug
          twitterHandle
          description
          ... on User {
            email
          }
        }
      }
      paymentMethods(service: "stripe") {
        id
        uuid
        name
        data
        monthlyLimitPerMember
        orders(hasActiveSubscription: true) {
          id
        }
      }
      connectedAccounts {
        id
        service
        username
        createdAt
        settings
      }
    }
  }
`;

const getCollectiveQuery = gql`
  query Collective($slug: String!) {
    Collective(slug: $slug) {
      id
      isActive
      type
      slug
      path
      createdByUser {
        id
      }
      name
      company
      image
      backgroundImage
      description
      longDescription
      twitterHandle
      website
      currency
      settings
      createdAt
      stats {
        id
        balance
        yearlyBudget
        backers {
          all
          users
          organizations
          collectives
        }
        collectives {
          hosted
          memberOf
        }
        transactions {
          id
          all
        }
        expenses {
          id
          all
        }
        updates
        events
        totalAmountSent
        totalAmountRaised
        totalAmountReceived
      }
      tiers {
        id
        slug
        type
        name
        description
        button
        amount
        presets
        interval
        currency
        maxQuantity
        stats {
          id
          totalOrders
          availableQuantity
        }
        orders(limit: 30) {
          fromCollective {
            id
            slug
            type
            name
            image
            website
          }
        }
      }
      isHost
      canApply
      host {
        id
        slug
        name
        image
      }
      members {
        id
        role
        createdAt
        description
        member {
          id
          description
          name
          slug
          type
          image
        }
      }
      ... on User {
        memberOf(limit: 60) {
          id
          role
          createdAt
          stats {
            totalDonations
            totalRaised
          }
          collective {
            id
            name
            currency
            slug
            path
            type
            image
            description
            longDescription
            backgroundImage
          }
        }
      }
      ... on Organization {
        memberOf(limit: 60) {
          id
          role
          createdAt
          stats {
            totalDonations
            totalRaised
          }
          collective {
            id
            name
            currency
            slug
            path
            type
            image
            description
            longDescription
            backgroundImage
          }
        }
      }
    }
  }
`;

const getEventCollectiveQuery = gql`
  query Collective($eventSlug: String!) {
    Collective(slug: $eventSlug) {
      id
      type
      slug
      path
      createdByUser {
        id
      }
      name
      image
      description
      longDescription
      startsAt
      endsAt
      timezone
      currency
      settings
      location {
        name
        address
        lat
        long
      }
      tiers {
        id
        slug
        type
        name
        description
        amount
        currency
        maxQuantity
      }
      parentCollective {
        id
        slug
        name
        mission
        currency
        backgroundImage
        image
        settings
      }
      stats {
        id
        balance
        expenses {
          id
          all
        }
        transactions {
          id
          all
        }
      }
      members {
        id
        createdAt
        role
        member {
          id
          name
          image
          slug
          twitterHandle
          description
        }
      }
      orders {
        id
        createdAt
        quantity
        publicMessage
        fromCollective {
          id
          name
          company
          image
          slug
          twitterHandle
          description
          ... on User {
            email
          }
        }
        tier {
          id
          name
        }
      }
    }
  }
`;

const getCollectiveCoverQuery = gql`
  query CollectiveCover($slug: String!) {
    Collective(slug: $slug) {
      id
      type
      slug
      path
      name
      currency
      backgroundImage
      settings
      image
      isHost
      tags
      stats {
        id
        balance
        updates
        events
        yearlyBudget
        totalAmountReceived
        backers {
          all
        }
      }
      createdByUser {
        id
      }
      host {
        id
        slug
        name
        image
      }
      parentCollective {
        id
        slug
        name
      }
      members {
        id
        role
        createdAt
        description
        member {
          id
          description
          name
          slug
          type
          image
        }
      }
    }
  }
`;

export const getPrepaidCardBalanceQuery = gql`
  query checkPrepaidPaymentMethod($token: String!) {
    prepaidPaymentMethod(token: $token) {
      id,
      name,
      currency,
      balance,
      uuid
    }
  }
`;

export const getSubscriptionsQuery = gql`
  query Collective($slug: String!) {
    Collective(slug: $slug) {
      id
      type
      slug
      createdByUser {
        id
      }
      name
      company
      image
      backgroundImage
      description
      twitterHandle
      website
      currency
      settings
      createdAt
      stats {
        id
        totalAmountSent
        totalAmountRaised
      }
      ordersFromCollective (subscriptionsOnly: true) {
        id
        currency
        totalAmount
        interval
        createdAt
        isSubscriptionActive
        isPastDue
        collective {
          id
          name
          currency
          slug
          type
          image
          description
          longDescription
          backgroundImage
        }
        fromCollective {
          id
          slug
          createdByUser {
            id
          }
        }
        paymentMethod {
          id
          uuid
          data
          name
        }
      }
      paymentMethods {
        id
        uuid
        service
        type
        data
        name
      }
      ... on User {
        memberOf(limit: 60) {
          id
          role
          createdAt
          stats {
            totalDonations
            totalRaised
          }
          collective {
            id
          }
        }
      }

      ... on Organization {
        memberOf(limit: 60) {
          id
          role
          createdAt
          stats {
            totalDonations
            totalRaised
          }
          collective {
            id
          }
        }
      }
    }
  }
`;

export const searchCollectivesQuery = gql`
  query search($term: String!, $limit: Int, $offset: Int) {
    search(term: $term, limit: $limit, offset: $offset) {
      collectives {
        id
        isActive
        type
        slug
        path
        name
        company
        image
        backgroundImage
        description
        longDescription
        website
        currency
        stats {
          id
          balance
          yearlyBudget
          backers {
            all
          }
        }
      }
      limit
      offset
      total
    }
  }
`;

export const addCollectiveData = graphql(getCollectiveQuery);
export const addCollectiveCoverData = graphql(getCollectiveCoverQuery, {
  options(props) {
    return {
      variables: {
        slug: props.collectiveSlug || props.slug
      }
    }
  }
});
export const addCollectiveToEditData = graphql(getCollectiveToEditQuery);
export const addEventCollectiveData = graphql(getEventCollectiveQuery);
export const addTiersData = graphql(getTiersQuery);
export const addSubscriptionsData = graphql(getSubscriptionsQuery);
export const addSearchQueryData = graphql(searchCollectivesQuery);

const refreshLoggedInUser = async (data) => {
  let res;

  if (data.LoggedInUser) {
    const user = new LoggedInUser(data.LoggedInUser);
    storage.set("LoggedInUser", user, 1000 * 60 * 60);
    return user;
  }

  try {
    res = await data.refetch();
    if (!res.data || !res.data.LoggedInUser) {
      storage.set("LoggedInUser", null);
      return null;
    }
    const user = new LoggedInUser(res.data.LoggedInUser);
    storage.set("LoggedInUser", user, 1000 * 60 * 60);
    return user;
  } catch (e) {
    console.error(">>> getLoggedInUser error:", e);
    storage.set("LoggedInUser", null);
    return null;
  }
};

const maybeRefreshAccessToken = async (currentToken) => {
  const { exp } = JSON.parse(atob(currentToken.split('.')[1]));
  const shouldUpdate = moment(exp * 1000).subtract(1, 'month').isBefore(new Date);
  if (shouldUpdate) {
    const { token } = await api.refreshToken(currentToken);
    window.localStorage.getItem('accessToken', token);
  }
};

export const addGetLoggedInUserFunction = (component) => {
  const accessToken = typeof window !== 'undefined' && window.localStorage.getItem('accessToken');
  if (!accessToken) return component;
  return graphql(getLoggedInUserQuery, {
    props: ({ data }) => ({
      data,
      getLoggedInUser: async () => {
        const token = window.localStorage.getItem('accessToken');
        if (!token) {
          storage.set("LoggedInUser", null);
          return null;
        }

        // Just issue the request, don't wait for this call
        maybeRefreshAccessToken(token);

        const cache = storage.get("LoggedInUser");
        if (cache) {
          refreshLoggedInUser(data); // we don't wait.
          return new LoggedInUser(cache);
        }
        return await refreshLoggedInUser(data);
      }
    })
  })(component);
}
