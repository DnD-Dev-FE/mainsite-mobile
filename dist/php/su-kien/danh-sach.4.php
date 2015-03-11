<?php
    $response = '';
    for ( $i=0; $i < 5; $i++ ) {
        $response .= '
            <li>
                <p><a href="posts.html#!events"><strong class="posts__cate">4. Sự kiện</strong></a>&nbsp;|&nbsp;<time class="posts__time">34 phút trước</time></p>
                <a href="post-details.html" title="">
                    <h3>Page 4: Cập nhật phiên bản mới</h3>
                    <img src="" title="Cập nhật phiên bản mới" alt="Cập nhật phiên bản mới" />
                </a>
            </li>
        ';
    }

    $response .= '
        <input type="hidden" id="itemTotal" value="57" />
        <input type="hidden" id="itemPerPage" value="10" />
    ';

    echo json_encode( $response );
?>