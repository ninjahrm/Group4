export const usercredential =
{
  username: 'crmtestuser',
  password: 'cRm_123$',
}

export const data = {
  subject: 'Order for ABC Corp',
  validTillDate: '2025-09-30',
  status: 'Confirmed',
  opportunity: 'TechNova First Deal',
  quote: 'SalesOrderWM',
  contactName: 'John K',
  // Billing Address Details
  billingAddress: '123 Business Park Blvd',
  billingPOBox: '45678',
  billingCity: 'San Francisco',
  billingState: 'California',
  billingPostalCode: '94107',
  billingCountry: 'USA',
  // Shipping Address Details
  shippingAddress: '789 Warehouse Lane',
  shippingPOBox: '89012',
  shippingCity: 'Los Angeles',
  shippingState: 'California',
  shippingPostalCode: '90001',
  shippingCountry: 'USA',
  product: 'Lenovo Laptop',
};

export const negativeTestCases = [
  {
    name: 'subject is empty',
    field: 'subject',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  /* {
    name: 'subject text more than 20 chars',
    field: 'subject',
    value: 'Sales Order for Laptop Deal',
    expectedValidationMessage: 'Please fill out this field',
  },  */
  {
    name: 'Till Date is empty',
    field: 'validTill',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Till Date is past',
    field: 'validTill',
    value: '2020-01-01', // Past date
    expectedValidationMessage: 'Value must be',
  },
  /*  {
     name: 'Till Date is invalid',
     field: 'validTill',
     value: '01-01-2022', // Invalid date format
     expectedValidationMessage: '',
   } */
  //Billing Fields
  {
    name: 'Billing Address is empty',
    field: 'billingAddress',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Billing PO Box is empty',
    field: 'billingPOBox',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Billing City is empty',
    field: 'billingCity',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Billing State is empty',
    field: 'billingState',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Billing postal code is empty',
    field: 'billingPostalCode',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Billing Country is empty',
    field: 'billingCountry',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  //Shipping Fields
  {
    name: 'Shipping Address is empty',
    field: 'shippingAddress',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Shipping PO Box is empty',
    field: 'shippingPOBox',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Shipping City is empty',
    field: 'shippingCity',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Shipping State is empty',
    field: 'shippingState',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Shipping postal code is empty',
    field: 'shippingPostalCode',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  {
    name: 'Shipping Country is empty',
    field: 'shippingCountry',
    value: '',
    expectedValidationMessage: 'Please fill out this field.',
  },
  //Other Fields
  {
    name: 'Opportunity is empty',
    field: 'opportunity',
    value: '',
    expectedValidationMessage: 'Please select an opportunity before submitting',
  },

  {
    name: 'Quote is empty',
    field: 'quote',
    value: '',
    expectedValidationMessage: 'Please select a quote before submitting',
  },

  {
    name: 'Contact is empty',
    field: 'contactName',
    value: '',
    expectedValidationMessage: 'Please select a contact before submitting',
  },

  {
    name: 'Product is empty',
    field: 'product',
    value: '',
    expectedValidationMessage: 'Please select a Product/Products before submitting.',
  },


  /*
  ,
  {
    name: 'invalid quantity',
    field: 'quantity',
    value: '-10',
    expectedValidationMessage: 'Quantity must be positive',
  },
  {
    name: 'missing status',
    field: 'status',
    value: '',
    expectedValidationMessage: 'Status is required',
  }, */

];

export const negativeTestCases1 = [


  /* {
   name: 'Till Date is past',
   field: 'validTill',
   value: '2020-01-01', // Past date
   expectedValidationMessage: 'Value must be',
 }, */

  {
    name: 'Product is empty',
    field: 'product',
    value: '',
    expectedValidationMessage: 'Please select a Product/Products before submitting.',
  },


];


export const fieldValidationCases = [
  {
    field: 'subject',
    label: 'Subject Field',
    cases: [
      {
        type: '> 20 chars',
        input: 'ThisSubjectIsWayTooLongToBeAccepted',
        expected: 'ThisSubjectIsWayTooL',
      },
      {
        type: 'Numeric',
        input: '123456',
        expected: '',
      },
      {
        type: 'Special chars',
        input: '!@#$%^&*()_+',
        expected: '',
      },
      {
        type: 'Alphanumeric',
        input: 'Order123',
        expected: 'Order',
      },
    ],
  },
  {
    field: 'status',
    label: 'Status Field',
    cases: [
      {
        type: '> 255 characters',
        input: 'A'.repeat(260), // 260 characters
        expected: 'A'.repeat(256), // Should truncate or only accept 256
      },
    ],
  },
  {
    field: 'billingAddress',
    label: 'Billing Address Field',
    cases: [
      {
        type: '< 50 chars',
        input: '1234 Elm Street, Springfield, IL 62704',
        expected: '1234 Elm Street, Springfield, IL 62704',
      },
      {
        type: '= 50 chars',
        input: '1234 Elm Street, Springfield, IL 62704 Apt B-12X12X',
        expected: '1234 Elm Street, Springfield, IL 62704 Apt B-12X12',
      },
      {
        type: '> 50 chars',
        input: '1234 Elm Street, Springfield, IL 62704 Apt B-12X12X ExtraData',
        expected: '1234 Elm Street, Springfield, IL 62704 Apt B-12X12',
      },
      {
        type: 'special chars',
        input: '1234 Elm St. #$%@! Springfield, IL 62704',
        expected: '1234 Elm St. #$%@! Springfield, IL 62704',
      },
    ],
  },
  {
    field: 'billingPOBox',
    label: 'Billing POBox Field',
    cases: [
      {
        type: 'valid - 5 digits',
        input: '12345',
        expected: '12345',
      },
      {
        type: 'valid - exactly 9 digits',
        input: '987654321',
        expected: '987654321',
      },
      {
        type: 'invalid - more than 9 digits',
        input: '1234567890',
        expected: '123456789', // should trim to 9 or throw validation error
      },
      {
        type: 'invalid - alphanumeric',
        input: '123AB456',
        expected: '123456', // or throw validation error
      },
      {
        type: 'invalid - special characters',
        input: '123@#456',
        expected: '123456', // or throw validation error
      },
      {
        type: 'valid - leading zeros',
        input: '000012345',
        expected: '12345',
      },
    ],
  },
  {
    field: 'billingCity',
    label: 'Billing City Field',
    cases: [
      {
        type: 'valid - short city name',
        input: 'Austin',
        expected: 'Austin',
      },
      {
        type: 'valid - exactly 20 letters',
        input: 'CharlottesvilleTown',
        expected: 'CharlottesvilleTown',
      },
      /* {
        type: 'invalid - more than 20 letters',
        input: 'Supercalifragilistic',
        expected: 'Supercalifragilist', // trimmed to 20 or validation error
      }, */
      {
        type: 'invalid - includes numbers',
        input: 'LosAngeles123',
        expected: 'LosAngeles', // accept only letters
      },
      {
        type: 'invalid - includes special characters',
        input: 'New@York!',
        expected: 'NewYork', // accept only letters
      },
      {
        type: 'valid - mixed case letters',
        input: 'SanFrancisco',
        expected: 'SanFrancisco',
      },
    ],
  },

  {
    field: 'billingState',
    label: 'Billing State Field',
    cases: [
      {
        type: 'valid - short state name',
        input: 'Texas',
        expected: 'Texas',
      },
      {
        type: 'valid - exactly 20 letters',
        input: 'NorthCarolinaState',
        expected: 'NorthCarolinaState',
      },
      /* {
        type: 'invalid - more than 20 letters',
        input: 'MassachusettsEasternState',
        expected: 'MassachusettsEaster', // trimmed to 20 or validation error
      }, */
      {
        type: 'invalid - includes numbers',
        input: 'Texas123',
        expected: 'Texas', // or validation error
      },
      {
        type: 'invalid - includes special characters',
        input: 'New*Jersey!',
        expected: 'NewJersey', // or validation error
      },
    ]
  },
  {
    field: 'billingCountry',
    label: 'Billing Country Field',
    cases: [
      {
        type: 'valid - short country name',
        input: 'India',
        expected: 'India',
      },
      {
        type: 'valid - exactly 20 letters',
        input: 'UnitedStatesOfAmerica',
        expected: 'UnitedStatesOfAmeric',
      },
      /*  {
         type: 'invalid - more than 20 letters',
         input: 'TheRepublicOfKazakhstan',
         expected: 'TheRepublicOfKazakhs', // trimmed to 20 or validation error
       }, */
      {
        type: 'invalid - includes numbers',
        input: 'India123',
        expected: 'India', // or validation error
      },
      {
        type: 'invalid - includes special characters',
        input: 'U@S#A!',
        expected: 'USA', // or validation error
      },
    ]
  },
  {
    field: 'billingPostalCode',
    label: 'Billing Postal Code Field',
    cases: [
      {
        type: 'valid - 5 digits',
        input: '90210',
        expected: '90210',
      },
      {
        type: 'valid - exactly 9 digits',
        input: '123456789',
        expected: '123456789',
      },
      {
        type: 'invalid - more than 9 digits',
        input: '9876543210',
        expected: '987654321', // trimmed or rejected
      },
      {
        type: 'invalid - includes letters',
        input: '12345ABCD',
        expected: '12345', // or validation error
      },
      {
        type: 'invalid - special characters',
        input: '12@#56789',
        expected: '1256789', // or validation error
      },
      {
        type: 'valid - leading zeros',
        input: '000123456',
        expected: '123456',
      },
    ]
  }, {
    field: 'shippingAddress',
    label: 'Shipping Address Field',
    cases: [
      {
        type: 'valid - short address',
        input: 'MainStreetShippingLocation',
        expected: 'MainStreetShippingLocation',
      },
      {
        type: 'valid - exactly 50 letters',
        input: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWX',
        expected: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWX',
      },
      {
        type: 'invalid - more than 50 letters',
        input: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZZZ',
        expected: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWX', // trimmed or error
      },
      {
        type: 'invalid - includes numbers',
        input: '123MainStreet',
        expected: '123MainStreet',
      },
      {
        type: 'invalid - includes special characters',
        input: 'Main@Street#One',
        expected: 'Main@Street#One',
      },

    ]
  }, {
    field: 'shippingPOBox',
    label: 'Shipping POBox Field',
    cases: [
      {
        type: 'valid - 5 digits',
        input: '12345',
        expected: '12345',
      },
      {
        type: 'valid - 9 digits',
        input: '987654321',
        expected: '987654321',
      },
      {
        type: 'invalid - more than 9 digits',
        input: '1234567890',
        expected: '123456789',
      },
      {
        type: 'invalid - includes letters',
        input: 'PO123BOX',
        expected: '123',
      },
      {
        type: 'invalid - includes special characters',
        input: '123@#456',
        expected: '123456',
      },
    ]
  }, {
    field: 'shippingCity',
    label: 'Shipping City Field',
    cases: [
      {
        type: 'valid - short city name',
        input: 'Boston',
        expected: 'Boston',
      },
      {
        type: 'valid - exactly 20 letters',
        input: 'MinneapolisShipping',
        expected: 'MinneapolisShipping',
      },
      {
        type: 'invalid - more than 20 letters',
        input: 'SuperLongCityNameTestInputMore',
        expected: 'SuperLongCityNameTes', // 20 letters only
      },
      {
        type: 'invalid - includes numbers',
        input: 'Chicago123',
        expected: 'Chicago',
      },
      {
        type: 'invalid - includes special characters',
        input: 'New@York',
        expected: 'NewYork',
      },

    ]
  },
  {
    field: 'shippingState',
    label: 'Shipping State Field',
    cases: [
      {
        type: 'valid - short state',
        input: 'Ohio',
        expected: 'Ohio',
      },
      {
        type: 'valid - exactly 20 letters',
        input: 'NorthCarolinaStateXX',
        expected: 'NorthCarolinaStateXX',
      },
      {
        type: 'invalid - more than 20 letters',
        input: 'MassachusettsEasterns',
        expected: 'MassachusettsEastern',
      },
      {
        type: 'invalid - includes numbers',
        input: 'Texas123',
        expected: 'Texas',
      },
      {
        type: 'invalid - includes special characters',
        input: 'New*Jersey!',
        expected: 'NewJersey',
      },

    ]
  },
  {
    field: 'shippingPostalCode',
    label: 'Shipping Postal Code Field',
    cases: [
      {
        type: 'valid - 5 digits',
        input: '75001',
        expected: '75001',
      },
      {
        type: 'valid - 9 digits',
        input: '123456789',
        expected: '123456789',
      },
      {
        type: 'invalid - more than 9 digits',
        input: '1234567891',
        expected: '123456789',
      },
      {
        type: 'invalid - includes letters',
        input: 'ZIP123456',
        expected: '123456',
      },
      {
        type: 'invalid - includes special characters',
        input: '123@#456',
        expected: '123456',
      },

    ]

  },
  {
    field: 'shippingCountry',
    label: 'Shipping Country Field',
    cases: [
      {
        type: 'valid - short country name',
        input: 'Canada',
        expected: 'Canada',
      },
      {
        type: 'valid - exactly 20 letters',
        input: 'UnitedKingdomCountry',
        expected: 'UnitedKingdomCountry',
      },
      {
        type: 'invalid - more than 20 letters',
        input: 'TheRepublicOfKazakhstan',
        expected: 'TheRepublicOfKazakhs',
      },
      {
        type: 'invalid - includes numbers',
        input: 'UK2024',
        expected: 'UK',
      },
      {
        type: 'invalid - includes special characters',
        input: 'U$A',
        expected: 'UA',
      },

    ]
  }
];

















