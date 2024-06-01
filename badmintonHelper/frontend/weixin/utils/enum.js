const ApplyStatusEnum = {
  Applied: 0,
  AlternatedApplied: 1,
  NotApplied: 2,
}
const ActivityStatusEnum = {
  Ended: 0,
  InProgress: 1,
  Cancel: 2,
}

const ChargingMethoEnum = {
  Before: 0,
  After: 1,
}

const RefundTicketEnum = {
  Before12: 0,
  Before6: 1,
  Before1: 2,
  Before0: 3,
  No: 4,
}

const GenderEnum = {
  Unknow: 0,
  Male: 1,
  Female: 2,
}

module.exports = {
  ActivityStatusEnum,
  ChargingMethoEnum,
  RefundTicketEnum,
  ApplyStatusEnum,
  GenderEnum
};