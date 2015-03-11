<?php
    $response = '';
    for ( $i=0; $i < 10; $i++ ) {
        $response .= '
            <li>
                <p><a href="posts.html#!news"><strong class="posts__cate">2. Tin tức</strong></a>&nbsp;|&nbsp;<time class="posts__time">34 phút trước</time></p>
                <a href="post-details.html" title="">
                    <h3>Page 2: Lưu ý về vấn đề nạp Xu vào 08:00 sáng 08.01.2015</h3>
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