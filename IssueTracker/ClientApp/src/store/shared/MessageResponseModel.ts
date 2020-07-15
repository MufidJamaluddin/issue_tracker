/**
 *  MessageResponseModel : Type of message response from server
 *  
 *  @author Mufid Jamaluddin 
 **/
export default interface MessageResponseModel
{
    // Status: Successed of Failed
    status: boolean

    // Code of Message: Standardization
    code: string

    // Message
    message: string
}