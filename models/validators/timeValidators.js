export const timeValidator = {
  validator: function(v) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
  },
  message: "Time must be in HH:MM format"
};

export const timezoneValidator = {
  validator: function(v) {
    return /^UTC[+-]([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
  },
  message: "Invalid timezone format. Use UTC±HH:MM format"
};