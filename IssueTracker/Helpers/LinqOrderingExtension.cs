using Newtonsoft.Json;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

/**
 * 
 *  LinqOrderingExtension : Order Query Linq by Property Name
 * 
 *  @author Mufid Jamaluddin
 *  
 **/
namespace IssueTracker.Helpers
{
    public static class LinqOrderingExtension
    {
        /**
         *  Order By Property Name
         *  Dengan Strict Case (Harus Tepat Sama)
         ***/
        public static IOrderedQueryable<T> OrderByPropertyName<T>(
            this IQueryable<T> model,
            string propertyNameToOrder,
            bool ascending = true
        )
        {
            Type type = typeof(T);
            PropertyInfo propertyToOrder = type.GetProperty(propertyNameToOrder);

            if (propertyToOrder == null)
            {
                throw new NullReferenceException(propertyNameToOrder);
            }

            IOrderedQueryable<T> modelOrdered;

            ParameterExpression param = Expression.Parameter(type);
            Expression<Func<T, object>> expression = Expression.Lambda<Func<T, object>>(
                Expression.Convert(Expression.Property(param, propertyToOrder), typeof(object)),
                param
            );

            if (ascending)
            {
                modelOrdered = model.OrderBy(expression);
            }
            else
            {
                modelOrdered = model.OrderByDescending(expression);
            }

            return modelOrdered;
        }

        /**
         *  Order By JSON Attribute Name (Newtonsoft),
         *  Dimana Bisa Beda Case Huruf Besar / Kecil (Ordinal Ignore Case)
         **/
        public static IOrderedQueryable<T> OrderByJsonPropertyName<T>(
            this IQueryable<T> model,
            string propertyNameToOrder,
            bool ascending = true
        )
        {
            PropertyInfo propertyToOrder = null;
            Type type = typeof(T);

            var properties = type
                .GetProperties()
                .Select(p => new
                {
                    Json = p.GetCustomAttributes(typeof(JsonPropertyAttribute), true).FirstOrDefault(),
                    Prop = p,
                })
                .ToArray();

            bool isFound = false;

            Array.ForEach(properties, p =>
            {
                if (p.Json != null && !isFound)
                {
                    JsonPropertyAttribute q = p.Json as JsonPropertyAttribute;

                    // REFLECTION CARI ATRIBUT [JsonProperty=".."]

                    if (string.Compare(q.PropertyName, propertyNameToOrder, StringComparison.OrdinalIgnoreCase) == 0)
                    {
                        propertyToOrder = p.Prop;
                        isFound = true;
                    }
                }
            });

            if (propertyToOrder == null || !isFound)
            {
                throw new NullReferenceException(propertyNameToOrder);
            }

            IOrderedQueryable<T> modelOrdered;

            ParameterExpression param = Expression.Parameter(type);
            Expression<Func<T, object>> expression = Expression.Lambda<Func<T, object>>(
                Expression.Convert(Expression.Property(param, propertyToOrder), typeof(object)),
                param
            );

            if (ascending)
            {
                modelOrdered = model.OrderBy(expression);
            }
            else
            {
                modelOrdered = model.OrderByDescending(expression);
            }

            return modelOrdered;
        }

    }
}
