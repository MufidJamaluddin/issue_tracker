using IssueTracker.Models.Datas;
using IssueTracker.Models.Datas.Schemas;
using System;
using System.Collections.Generic;

using System.Linq;
using System.Security.Cryptography;
using System.Text;

/**
 * 
 * @author Mufid Jamaluddin
 **/
namespace IssueTracker.ToDevs.SeedData
{
    public class SeedUserData : ASeedData
    {
        public SeedUserData(IssueTrackerDbContext dbContext) : base(dbContext)
        {

        }

        public override void RunSeed()
        {
            if (DbContext.Users.Any())
            {
                return;
            }

            using SHA256 hasher = SHA256.Create();

            string passwordplain = "Maju12345";

            string password = Convert
                .ToBase64String(hasher.ComputeHash(Encoding.ASCII.GetBytes(passwordplain)));

            DbContext.Users.AddRange(new List<User>
            {
                new User
                {
                    Id = "USR-001",
                    Name = "Mufid Jamaluddin",
                    Email = "mufid.jamaluddin@gmail.com",
                    Password = password,
                    Image = "mufid.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-002",
                    Name = "Kivlan Aziz Al Falaah",
                    Email = "kivlan.aziz@gmail.com",
                    Password = password,
                    Image = "kivlan.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-003",
                    Name = "Achmad Fadhitya",
                    Email = "achmad.fadhitya@gmail.com",
                    Password = password,
                    Image = "afadhit.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-004",
                    Name = "Reza Dwi Kurniawan",
                    Email = "reza.d.kurniawan@gmail.com",
                    Password = password,
                    Image = "rezad.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-005",
                    Name = "Wira Kusuma Wardana",
                    Email = "wirakw@gmail.com",
                    Password = password,
                    Image = "wirakw.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-006",
                    Name = "Adhitya Noor Muslim",
                    Email = "adhitya@gmail.com",
                    Password = password,
                    Image = "adhitya.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-007",
                    Name = "Agit Prasetya",
                    Email = "agit@gmail.com",
                    Password = password,
                    Image = "wirakw.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-008",
                    Name = "Agustina Bau",
                    Email = "agustina@gmail.com",
                    Password = password,
                    Image = "agustina.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-009",
                    Name = "Akmal Muhammad Kristanto",
                    Email = "akmal@gmail.com",
                    Password = password,
                    Image = "akmal.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-010",
                    Name = "Alpin Jestineera",
                    Email = "alpin@gmail.com",
                    Password = password,
                    Image = "alpin.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-011",
                    Name = "Auliya Aqma Dinillah",
                    Email = "auliya@gmail.com",
                    Password = password,
                    Image = "auliya.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-012",
                    Name = "Rohmat Dasuki",
                    Email = "rohmat@gmail.com",
                    Password = password,
                    Image = "rohmat.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-013",
                    Name = "Jeremia Geraldi Sihombing",
                    Email = "jeremia@gmail.com",
                    Password = password,
                    Image = "jeremia.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-014",
                    Name = "Gerry Agustian Juneu",
                    Email = "gerry@gmail.com",
                    Password = password,
                    Image = "gerry.jpg",
                    Role = "User",
                },
                new User
                {
                    Id = "USR-015",
                    Name = "Dede Diana Nasim",
                    Email = "dedediana@gmail.com",
                    Password = password,
                    Image = "dedediana.jpg",
                    Role = "User",
                },
            });

            DbContext.SaveChanges();
        }
    }
}