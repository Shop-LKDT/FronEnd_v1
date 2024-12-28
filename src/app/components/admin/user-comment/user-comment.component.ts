import { Role } from './../../../models/role';
import { User } from './../../../models/user';
import { DatePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Comment } from '../../../models/comment';
import { CommentService } from '../../../services/comment.service';
import { ApiResponse } from '../../../responses/api.response';
import { TokenService } from '../../../services/token.service';
@Component({
  selector: 'app-user-comment',
  standalone: true,
  imports: [NgFor,DatePipe],
  templateUrl: './user-comment.component.html',
  styleUrl: './user-comment.component.scss'
})

export class UserCommentComponent implements OnInit {
  comments: Comment[] = [];
  users: User[] = [];

  totalUsers: number = 100; // Tổng số người dùng giả định
  usersPerPage: number = 5; // Số người dùng trên mỗi trang
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = Math.ceil(this.totalUsers / this.usersPerPage); // Tổng số trang
  constructor(
    private commentService: CommentService,
  ) { }
  ngOnInit() {
    this.getAllComments();
  }
  getAllComments() {
    this.commentService.getAllComments().subscribe({
      next: (response:ApiResponse) => {
        this.comments = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  deleteComment(commentId: number) {
    alert("Bạn có chắc chắn muốn xóa bình luận này không?");
    this.commentService.deleteComment(commentId).subscribe({
      next: (response: ApiResponse) => {
        this.getAllComments();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllComments();
    }
  }

}
