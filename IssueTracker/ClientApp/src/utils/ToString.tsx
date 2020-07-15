const ToString = (val: FormDataEntryValue): string => {
    if (val) return val.toString()
    else return null
}

export default ToString