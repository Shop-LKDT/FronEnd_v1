import { AdminComponent } from "./admin.component";
import { OrderAdminComponent } from "./order/order.admin.component";
import { DetailOrderAdminComponent } from "./detail-order/detail.order.admin.component";
import { Route, Router,Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductAdminComponent } from "./product/product.admin.component";
import { CategoryAdminComponent } from "./category/category.admin.component";
import { UpdateProductAdminComponent } from "./product/update/update.product.admin.component";
import { InsertProductAdminComponent } from "./product/insert/insert.product.admin.component";
import { InsertCategoryAdminComponent } from "./category/insert/insert.category.admin.component";
import { UpdateCategoryAdminComponent } from "./category/update/update.category.admin.component";
import { UserAdminComponent } from "./user/user.admin.component";
import { UserCommentComponent } from "./user-comment/user-comment.component";
import { PostComponent } from "./post/post.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { PromotionComponent } from "./promotion/promotion.component";
import { PromotionConditionsComponent } from "./promotion-conditions/promotion-conditions.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SupplierComponent } from "./supplier/supplier.component";
import { ReportFromCustomerComponent } from "./report-from-customer/report-from-customer.component";

export const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
          {
            path: 'home',
            component: DashboardComponent
          },
            {
                path: 'orders',
                component: OrderAdminComponent
            },
            {
                path: 'products',
                component: ProductAdminComponent
            },
            {
                path: 'categories',
                component: CategoryAdminComponent
            },
            //sub path
            {
                path: 'orders/:id',
                component: DetailOrderAdminComponent
            },
            {
                path: 'products/update/:id',
                component: UpdateProductAdminComponent
            },
            {
                path: 'products/insert',
                component: InsertProductAdminComponent
            },
            //comment
            {
              path: 'comment',
              component: UserCommentComponent
            },
            //post bài viết
            {
              path: 'baiviet',
              component: PostComponent
            },
            //inventory
            {
              path: 'tonkho',
              component: InventoryComponent
            },
             //supplier
             {
              path: 'supplier',
              component: SupplierComponent
            },
            //report
            {
              path: 'report',
              component: ReportFromCustomerComponent
            },
            //promotions
            {
              path: 'discount',
              component: PromotionComponent
            },
            //promotions condition
            {
              path: 'dieukienkhuyenmai',
              component: PromotionConditionsComponent
            },
            //categories
            {
                path: 'categories/update/:id',
                component: UpdateCategoryAdminComponent
            },
            {
                path: 'categories/insert',
                component: InsertCategoryAdminComponent
            },
            {
                path: 'users',
                component: UserAdminComponent
            },
        ]
    }
];
/*
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
*/
