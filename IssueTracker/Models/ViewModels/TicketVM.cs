﻿using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.ViewModels
{
    public class TicketVM : BaseVM
    {
        [StringLength(10)]
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [StringLength(100)]
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [StringLength(256)]
        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }

        [JsonProperty(PropertyName = "created_date")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty(PropertyName = "assignee")]
        public string AssigneeName { get; set; }

        [JsonProperty(PropertyName = "assignee_id")]
        public string AssigneeId { get; set; }

        [JsonProperty(PropertyName = "owner")]
        public string OwnerName { get; set; }

        [JsonProperty(PropertyName = "owner_id")]
        public string OwnerID { get; set; }

        [JsonProperty(PropertyName = "category_name")]
        public string CategoryName { get; set; }

        [JsonProperty(PropertyName = "category_id")]
        public string CategoryID { get; set; }

        [JsonProperty(PropertyName = "status")]
        public string StatusName { get; set; }

        [JsonProperty(PropertyName = "status_id")]
        public string StatusID { get; set; }

        [JsonProperty(PropertyName = "status_color", NullValueHandling = NullValueHandling.Ignore)]
        public string StatusColor { get; set; }

        [JsonProperty(PropertyName = "see", NullValueHandling = NullValueHandling.Ignore)]
        public string SeeType { get; set; }

        [JsonProperty(PropertyName = "ismyownticket", NullValueHandling = NullValueHandling.Ignore)]
        public bool IsMyOwnTicket { get; set; }

        [JsonProperty(PropertyName = "ismyassignedticket", NullValueHandling = NullValueHandling.Ignore)]
        public bool IsMyAssignedTicket { get; set; }

        [JsonIgnore]
        public string MyUserId { get; set; }

        public void SetLoggedUser(string loggedUserId)
        {
            if (AssigneeId == null && OwnerID == null && loggedUserId == null)
            {
                throw new ArgumentNullException("The Assignee, Owner, dan Current User must be set!");
            }

            IsMyAssignedTicket = string.Compare(loggedUserId, AssigneeId, StringComparison.OrdinalIgnoreCase) == 0;
            IsMyOwnTicket = string.Compare(loggedUserId, OwnerID, StringComparison.OrdinalIgnoreCase) == 0;
        }
    }
}
