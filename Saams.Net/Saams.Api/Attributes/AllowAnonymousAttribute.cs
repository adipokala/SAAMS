﻿namespace Saams.Api.Attributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
    public class AllowAnonymousAttribute : Attribute
    {
    }
}
