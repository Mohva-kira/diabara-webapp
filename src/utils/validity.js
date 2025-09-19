export const isSubEnded = (data) => {

    console.log('data validity', data)

    let sub = data[0]
    let today = new Date()
    console.log('sub', sub)
    let end_date = new Date(sub.attributes.end_date)
    console.log('end date ', end_date)
    if( end_date.getTime() < today.getTime() ) {

        console.log('abonnement')
        alert('Votre abonnement à expirer')
        return false
    }

    return true
} 