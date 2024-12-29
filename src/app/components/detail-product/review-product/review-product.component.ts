import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../services/comment.service';
import { Comment } from '../../../models/comment';
import { ApiResponse } from '../../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { InsertCommentDTO } from '../../../dtos/comment/insert.comment.dto';
@Component({
  selector: 'app-reviews-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ReviewProductComponent implements OnInit {
  @Input() productId: any;
  reviews: Comment[] = [];
  countCmt: number = 3;
  insertCommentDTO: InsertCommentDTO = {
    product_id: 0,
    content: '',
    user_id: 0,
    ratting: 5,
  };
  rating = 5;
  newComment = '';
  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    console.log(this.productId);
    this.getAllCommentsByProduct(this.productId);
    this.reviews = this.reviews.slice(this.countCmt);

  }
  getAllCommentsByProduct(productId: number) {
    this.commentService.getAllcommentsByProduct(productId).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.reviews = apiResponse.data;
        console.log(this.reviews);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      },
    });
  }
  handleSubmitReview() {
    this.setComent(this.newComment);
    this.insertCommentDTO.product_id = this.productId;
    this.insertCommentDTO.ratting = this.rating;
    this.insertCommentDTO.content = this.newComment;
    console.log(this.insertCommentDTO);

    if (this.insertCommentDTO.content.trim() !== '') {
      console.log('Comment content:', this.insertCommentDTO.content);
      this.commentService.insertComment(this.insertCommentDTO).subscribe({
        next: (ApiResponse) => {
          this.getAllCommentsByProduct(this.productId);
          this.insertCommentDTO.content = '';
          this.newComment = '';
          this.rating = 0;
        },

        error: (error: HttpErrorResponse) => {
          console.error('Error adding comment:', error.message);
        },
      });
    } else {
      console.log('Comment cannot be empty.');
    }
  }

  calculateAverageRating(reviews: Comment[]) {
    const totalStars = reviews.reduce((acc, review) => acc + review.ratting, 0);
    return reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : 0;
  }

  calculateStarPercentages(reviews: Comment[]) {
    const starCount = [5, 4, 3, 2, 1];
    const percentages: { [key: number]: number } = {};
    const totalReviews = reviews.length;

    starCount.forEach((star) => {
      const starReviews = reviews.filter(
        (review) => review.ratting === star
      ).length;
      percentages[star] = totalReviews ? (starReviews / totalReviews) * 100 : 0;
    });

    return percentages;
  }

  setRating(star: number) {
    this.rating = star;
  }
  setComent(comment: string) {
    this.newComment = comment;
  }
  loadMoreReviews() {
    this.countCmt += 3;
    this.getAllCommentsByProduct(this.productId);
    this.reviews = this.reviews.slice(this.countCmt);
  }
  rutgonReviews() {
    if (this.countCmt > 3) {
      this.reviews = this.reviews.slice(3);
      this.countCmt = 3;
    }
    // this.reviews = this.reviews.slice(this.countCmt);
  }
}
