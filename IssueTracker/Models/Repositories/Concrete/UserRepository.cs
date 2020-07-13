using IssueTracker.Models.Datas;
using IssueTracker.Models.Datas.Schemas;
using IssueTracker.Models.ViewModels;
using IssueTracker.Models.ViewModels.Shared;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace IssueTracker.Models.Repositories
{
    public class UserRepository : ABaseRepository<UserVM>, IUserRepository
    {
        public UserRepository(IssueTrackerDbContext dbContext) : base(dbContext) { }

        public override IQueryable<UserVM> GetModel()
        {
            IQueryable<UserVM> model = DbContext.Users.Select(u => new UserVM
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                Image = u.Image,
                Password = u.Password,
            });

            return model;
        }

        public override IQueryable<UserVM> GetSearchedModel(UserVM searchedData)
        {
            IQueryable<UserVM> model = GetModel();

            string email = searchedData?.Email;
            string id = searchedData?.Id;

            model = model.Where(
                u =>
                    u.Email == email ||
                    u.Id == id
            );

            return model;
        }

        public override IQueryable<UserVM> GetSearchedModel(SearchPaginationRequest<UserVM> request)
        {
            IQueryable<UserVM> model = GetModel();

            string email = request?.SearchData?.Email;
            string id = request?.SearchData?.Id;
            string name = request?.SearchData?.Name;
            string role = request?.SearchData?.Role;

            if (!string.IsNullOrEmpty(email))
            {
                model = model.Where(u => u.Email.Contains(email));
            }

            if (!string.IsNullOrEmpty(id))
            {
                model = model.Where(u => u.Id == id);
            }

            if (!string.IsNullOrEmpty(name))
            {
                model = model.Where(u => u.Name.Contains(name));
            }

            if (!string.IsNullOrEmpty(role))
            {
                model = model.Where(u => u.Role.Contains(role));
            }

            return model;
        }

        protected string CreateNewUserId(string lastId)
        {
            if (lastId == null)
            {
                return "USR-001";
            }

            string[] ids = lastId.Split('-');

            if (int.TryParse(ids[1], out int id_number))
            {
                id_number += 1;
                ids[1] = id_number.ToString(CultureInfo.InvariantCulture).PadLeft(3, '0');
            }

            string newIds = string.Join('-', ids);

            return newIds;
        }

        public override CommonResponse<UserVM> SaveData(UserVM data, string transactionId)
        {
            CommonResponse<UserVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            using SHA256 hasher = SHA256.Create();

            string lastId = DbContext.Users.Select(u => u.Id).OrderByDescending(u => u).FirstOrDefault();

            User userData = new User
            {
                Id = CreateNewUserId(lastId),
                Name = data?.Name,
                Email = data.Email,
                Image = data.Image,
                Password = Encoding.ASCII.GetString(
                    hasher.ComputeHash(Encoding.ASCII.GetBytes(data.Password))
                ),
            };

            DbContext.Add(userData);

            UserHistory userHistory = new UserHistory();
            userHistory.FillFromUser(
                userData,
                transactionId,
                1,
                TableTransactionOperation.Insert
            );

            DbContext.Add(userHistory);

            if (DbContext.SaveChanges() > 0)
            {
                data.Id = userData.Id;

                return new CommonResponse<UserVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Retrieve Data is Success!",
                    Data = new UserVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Save Data Failed! Please Contact an Web Administrator!",
                    Data = new UserVM[] { data },
                };
            }
        }

        public override CommonResponse<UserVM> UpdateData(UserVM data, string transactionId)
        {
            CommonResponse<UserVM> response = ValidateParameter(data);

            if (response != null)
            {
                return response;
            }

            if (string.IsNullOrEmpty(data?.Id))
            {
                return new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-001",
                    Message = "Please fill the ID!",
                    Data = new UserVM[] { data },
                };
            }

            using SHA256 hasher = SHA256.Create();

            IQueryable<User> lastDataContext = DbContext.Users.AsQueryable();

            lastDataContext = lastDataContext.Where(u =>
                u.Id.Equals(data.Id)
            );

            User lastData = lastDataContext.FirstOrDefault();

            if (lastData == null)
            {
                return new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-004",
                    Message = "Ubah Data Gagal! Data Tidak Ditemukan!",
                    Data = new UserVM[] { data },
                };
            }

            lastData.Name = data.Name;
            lastData.Image = data.Image;

            if (!string.IsNullOrEmpty(data.Password))
            {
                lastData.Password = Encoding.ASCII.GetString(
                    hasher.ComputeHash(Encoding.ASCII.GetBytes(data.Password))
                );
            }

            //DbContext.Add(lastData);

            int historySequence = lastData?.UserHistories?
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault() ?? 0;

            UserHistory userHistory = new UserHistory();
            userHistory.FillFromUser(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Update
            );

            DbContext.Add(userHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<UserVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Update Data is Success!",
                    Data = new UserVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Update Data Failed! Please Contact an Web Administrator!",
                    Data = new UserVM[] { data },
                };
            }
        }

        public override CommonResponse<UserVM> DeleteData(UserVM data, string transactionId)
        {
            IQueryable<User> lastDataContext = DbContext.Users.AsQueryable();

            if (string.IsNullOrEmpty(data?.Id))
            {
                return new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-001",
                    Message = "Please fill the ID!",
                    Data = new UserVM[] { data },
                };
            }

            lastDataContext = lastDataContext.Where(u =>
                u.Id.Equals(data.Id)
            );

            User lastData = lastDataContext.FirstOrDefault();

            int historySequence = lastData?.UserHistories?
                .Select(u => u.Seq)
                .OrderByDescending(u => u)
                .FirstOrDefault() ?? 0;

            DbContext.Remove(lastData);

            UserHistory userHistory = new UserHistory();
            userHistory.FillFromUser(
                lastData,
                transactionId,
                historySequence + 1,
                TableTransactionOperation.Delete
            );

            DbContext.Add(userHistory);

            if (DbContext.SaveChanges() > 0)
            {
                return new CommonResponse<UserVM>
                {
                    Status = true,
                    Code = "S",
                    Message = "Delete Data is Success!",
                    Data = new UserVM[] { data },
                };
            }
            else
            {
                return new CommonResponse<UserVM>
                {
                    Status = false,
                    Code = "E-003",
                    Message = "Delete Data Failed! Please Contact an Web Administrator!",
                    Data = new UserVM[] { data },
                };
            }
        }
    }
}
