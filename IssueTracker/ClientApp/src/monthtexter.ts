/**
 * @author Mufid Jamaluddin
 **/
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function getMonthName(date: Date)
{
    return monthNames[date.getMonth()];
}
