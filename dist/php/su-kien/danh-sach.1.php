<?php
    sleep(1);
    for ( $i=0; $i < 5; $i++ ) {
        echo('
            <li>
                <p><strong class="posts__cate">1. Sự kiện</strong>&nbsp;|&nbsp;<time class="posts__time">34 phút trước</time></p>
                <a href="post-details.html" title="">
                    <h3>Page 1: Cập nhật phiên bản mới</h3>
                    <img src="" title="Cập nhật phiên bản mới" alt="Cập nhật phiên bản mới" />
                </a>
            </li>
        ');
    }
?>
<input type="hidden" id="itemTotal" value="34" />
<input type="hidden" id="itemPerPage" value="10" />