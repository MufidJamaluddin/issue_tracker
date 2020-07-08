/**
 *  PaginationDataModel<T> : Type of pagination data response from server
 *  T: Type of data item
 *
 *  @author Mufid Jamaluddin
**/
export default interface PaginationResponseModel<T>
{
    // Data of Page
    data: Array<T>

    // Size of Page
    size: number

    // Current Page Number of Data
    page: number

    // Total Page of Filtered Data
    totalPages: number
}