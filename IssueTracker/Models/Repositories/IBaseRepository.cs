using IssueTracker.Models.ViewModels.Shared;
using System.Collections.Generic;

/**
 * Interface Repository
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.Models.Repositories
{
    public interface IBaseRepository<T>
    {
        /**
         *  Mendapatkan Data Per Page
         **/
        public PaginationResponse<T> GetDataPaginated(SearchPaginationRequest<T> request);

        /**
         *  Mendapatkan Jumlah Smeua Data
         **/
        public int CountAllData();

        /**
         *  Mendapatkan Satu Data
         **/
        public T GetOne(T searchedData);

        /**
         *  Mendapatkan Semua Data
         **/
        public IEnumerable<T> GetAllData();

        /**
         *  Menyimpan Data
         **/
        public CommonResponse<T> SaveData(T data, string transactionId);

        /**
         *  Mengubah Data berdasarkan Primary Key pada Kelas T
         **/
        public CommonResponse<T> UpdateData(T data, string transactionId);

        /**
         *  Menghapus Data
         **/
        public CommonResponse<T> DeleteData(T data, string transactionId);
    }
}
