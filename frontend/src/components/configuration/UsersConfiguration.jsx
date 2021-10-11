import React from 'react'
import PropTypes from 'prop-types'

import {
  CRUDF,
  CreateTypeForm,
  EditTypeForm,
  TypeShow
} from '@molaux/mui-crudf'

const addressConfiguration = {
  translations: {
    fields: {
      label: 'Name',
      street: 'Street',
      zipCode: 'Zipcode',
      city: 'Town',
      country: 'Country',
      comment: 'Comment'
    }
  },
  layout: {
    hide: ['name', 'Suppliers', 'Users', 'id', 'createdAt', 'updatedAt', 'Customers'],
    layout: [
      ['label'],
      ['street'],
      ['zipCode', 'city'],
      ['country'],
      ['comment']
    ]
  }
}

const CreateAddressForm = CreateTypeForm({
  typeName: 'Address',
  ...addressConfiguration
})

const EditAddressForm = EditTypeForm({
  typeName: 'Address',
  ...addressConfiguration
})

const AddressShow = TypeShow({
  typeName: 'Address',
  ...addressConfiguration
})

const UsersConfiguration = ({
  className,
  initialView,
  onLink
}) => (
  <CRUDF
    className={className}
    typeName="User"
    initialView={initialView?.view}
    initialValue={initialView?.value}
    handles={{
      Group: (view, o) => onLink('Group', view, o)
    }}
    translations={{
      fields: {
        createdAt: 'Creation date',
        updatedAt: 'Last modification date',
        firstName: 'Firstname',
        lastName: 'Lastname',
        name: 'Complete name',
        comment: 'Comment',
        enabled: 'Active',
        password: 'Password',
        authenticationType: 'Authentication type',
        login: 'Login',
        phone: 'Phone',
        email: 'Mail',
        Address: 'Address',
        Groups: 'Groups',
        Permissions: 'Extra permissions'
      },
      type: {
        singular: 'User',
        plural: 'Users',
        'User creation': 'New user',
        'User edition': 'Update user'
      }
    }}
    listLayout={{
      order: [
        'name',
        'login',
        'enabled',
        'Address',
        'phone',
        'email',
        'Groups',
        'Permissions',
        'comment'
      ],
      layout: {
        Permissions: { maxLength: 8 }
      },
      hide: [
        'id', 'firstName', 'lastName', 'password', 'authenticationType',
        'Customers', 'Logs', 'PlanningTemplates', 'WorkPeriods',
        'createdAt', 'updatedAt'
      ]
    }}
    showLayout={{
      layout: [
        ['enabled'],
        ['name', 'login'],
        ['phone', 'email'],
        ['Groups', 'Permissions'],
        ['Address'],
        ['comment'],
        ['createdAt', 'updatedAt']
      ],
      hide: [
        'id', 'lastName', 'firstName', 'authenticationType',
        'Customers', 'Logs', 'PlanningTemplates', 'WorkPeriods',
        'password'
      ],
      components: {
        Address: AddressShow
      }
    }}
    editLayout={{
      layout: [
        ['enabled'],
        ['firstName', 'lastName'],
        ['login', 'password'],
        ['phone', 'email'],
        ['Groups', 'Permissions'],
        ['Address'],
        ['comment']
      ],
      hide: [
        'id', 'name', 'authenticationType',
        'addressId', 'Customers', 'Logs', 'PlanningTemplates', 'WorkPeriods',
        'createdAt', 'updatedAt'
      ],
      components: {
        Address: EditAddressForm
      }
    }}
    createLayout={{
      layout: [
        ['enabled'],
        ['firstName', 'lastName'],
        ['login', 'password'],
        ['phone', 'email'],
        ['Groups', 'Permissions'],
        ['Address'],
        ['comment']
      ],
      hide: [
        'id', 'name', 'authenticationType',
        'addressId', 'Customers', 'Logs', 'PlanningTemplates', 'WorkPeriods',
        'createdAt', 'updatedAt'
      ],
      components: {
        Address: CreateAddressForm
      }
    }}
  />
)

UsersConfiguration.propTypes = {
  className: PropTypes.string,
  initialView: PropTypes.shape({
    view: PropTypes.string,
    value: PropTypes.shape({})
  }),
  onLink: PropTypes.func
}

UsersConfiguration.defaultProps = {
  className: null,
  initialView: null,
  onLink: () => null
}

export default UsersConfiguration
