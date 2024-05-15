export function extractQueryParams(query) { // ?search=Amanda&page=2
    const removeQuestionMark = query.substr(1) // search=Amanda&page=2
    const toArray = removeQuestionMark.split('&') // ['search=Amanda', 'page=2']

    return toArray.reduce((qp, param) => {
        const [key, value] = param.split('=') // const key = 'search', value = 'Amanda'

        qp[key] = value // qp: { search: 'Amanda', page: '2' }

        return qp
    }, {})
}