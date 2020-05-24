const VALIDE_ROLES = {
  isNotEmpty: (value, errorMsg) => {
    if (!value || value === '') return errorMsg
  },
  minLength: (value, length, errorMsg) => {
    if (!value || value === '') return errorMsg
    if (value.length < length) return errorMsg
  }
}
export default VALIDE_ROLES
